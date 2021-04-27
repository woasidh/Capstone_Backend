const express = require('express');
const router = express.Router();

const { Subject, Lecture } = require('../models/subjects');
const { User } = require('../models/users');
const { auth, professorAuth } = require('../middleware/authentication');

const crypto = require('crypto');
const moment = require('moment');
require('moment-timezone');

moment.tz.setDefault('Asia/Seoul');

// 강의 개설
router.post('/create', professorAuth, (req, res) => {
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/create' 
        #swagger.responses[200] = {
            description: '성공시 success, code 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'time과 days는 배열, days는 0~6까지 일요일부터 토요일을 의미',
            schema: { $ref: "#/definitions/createSubject" }
        } */
    
    const salt = Math.round((new Date().valueOf() + Math.random())) + "";
    const hashCode = crypto.createHash("sha512").update(salt).digest('hex').slice(0, 16);

    User.findOne({ email: req.session.email }, (err, user) => {
        const subject = new Subject({
            name: req.body.name,
            professor: user._id,
            start_period: req.body.start_period,
            end_period: req.body.end_period,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            days: req.body.days,
            code: hashCode
        });
        subject.save((err, doc) => {
            if (err) console.log(err);
            else {
                user.subjects.push(doc._id);
                user.save((err) => {
                    if (err) console.log(err);
                    else {
                        res.status(200).json({
                            success: true,
                            code: hashCode
                        });
                    }
                });
            }
        });
    });
});

// 강의 방 참가
router.post('/join', auth, (req, res) => {
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/join' 
        #swagger.responses[200] = {
            description: '성공시 success, subject 객체 반환,
            \n해당하는 코드의 강의가 없을 시, success: false, codeValidation: false 반환,
            \n이미 참여한 수업일 경우, success: false, subjectExist 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '참여코드 입력',
            schema: { 
                $code: ""
            }
        } */

    User.findOne({ email: req.session.email }, (err, user) => {
        if(err) console.log(err);
        
        Subject.findOne({ code: req.body.code }, (err, subject) => {
            if (err) console.log(err);
            else if (subject === null) res.status(200).json({ 
                success: false,
                codeValidation: false
            });
            else {
                if (user.subjects.includes(subject._id)) res.status(200).json({
                    success: false,
                    subjectExist: true
                });
                user.subjects.push(subject._id);
                user.save((err) => {
                    if (err) console.log(err);
                    else {
                        subject.students.push(user._id);
                        subject.save((err) => {
                            if (err) console.log(err);
                            else {
                                res.status(200).json({ 
                                    success: true,
                                    subject
                                });
                            }
                        });
                    }
                });
            }
        });
    });
});

// 내 강의 목록 확인
router.get('/get/mySubjects', auth, (req, res) => {
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/get/mySubjects' 
        #swagger.responses[200] = {
            description: '성공 시, 본인이 수강하고 있는 강의들을 subjects로 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
        }
    */
    User.findOne({ email: req.session.email }).populate('subjects').exec((err, user)=>{
        if(err) res.status(500).json(err);
        else {
            res.status(200).json({
                subjects: user.subjects
            });
        }
    });
});

// 수업 시작하기
router.post('/lecture/start', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/lecture/start' 
        #swagger.responses[200] = {
            description: 'success, lecture 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'subjectId, 옵션만 지정하면 나머지는 기본 값으로 할당되어 저장됨',
            schema: {
                $subjectId: 0,
                $options: [{
                    $subtitle: false,
                    $record: false,
                    $attendance: false,
                    $limit: 5
                }]
            }
        } */
    Subject.findOne({ _id: req.body.subjectId }, (err, subject)=>{
        if (err) res.status(500).json(err);
        else {
            const today = moment();

            const lecture = new Lecture({
                date: today.format('YYYY-MM-DD'),
                status: 'inProgress',
                start_time: today.format('hh:mm'),
                subject: subject._id,
                options: [{
                    subtitle: req.body.subtitle,
                    record: req.body.record,
                    attendance: req.body.attendance,
                    limit: req.body.limit
                }]
            });
            lecture.save((err, lecture)=>{
                if (err) res.status(500).json(err);
                else {
                    subject.lectures.push(lecture._id);
                    
                    res.status(200).json({
                        success: true,
                        lecture: lecture
                    });
                }
            });
        }
    })
});

// 수업 종료하기
router.put('/lecture/close', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/lecture/close' 
        #swagger.responses[200] = {
            description: 'success, lecture 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $lectureId: 0
            }
        } */
    Lecture.findOneAndUpdate({ _id: req.body.lectureId }, {
        status: 'done',
        end_time: moment().format('hh:mm')
    }, { new: true }, (err, lecture)=>{
        if (err) res.status(500).json(err);
        else {
            res.status(200).json({
                success: true,
                lecture: lecture
            });
        }
    });
});

// 해당 과목의 현재 진행중인 수업 참가
router.put('/lecture/join', auth, (req, res)=>{
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/lecture/join' 
        #swagger.responses[200] = {
            description: 'success, lecture 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $subjectId: 0
            }
        } */
    Subject.findOne({ _id: req.body.subjectId }).populate('lectures').exec((err, subject)=>{
        const currentLecture = subject.lectures[subject.lectures.length - 1];

        if (currentLecture.status === 'inProgress') {
            Lecture.findOneAndUpdate({ _id: currentLecture._id }, {
                $push: { students: { student: req.session._id }}
            }, { new: true }, (err, lecture)=>{
                if (err) res.status(500).json(err);
                else {
                    res.status(200).json({
                        success: true,
                        existInProgressLecture: true,
                        lecture: lecture
                    });
                }
            });
        }
        else {
            res.status(200).json({
                success: false,
                existInProgressLecture: false
            });
        }
    });
});

module.exports = router;