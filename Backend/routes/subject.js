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
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '
                성공시 success, code 반환, time과 days는 배열, days는 0~6까지 일요일부터 토요일을 의미
                \n403 - type이 professor가 아닌 경우,
                \n401 - user가 로그인이 되지 않은 경우,
                \n200 - success : true, code 반환',
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
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '
                200 - 성공시 success, subject 객체 반환,
                \n401 - 로그인이 되지 않은 경우',
            schema: { 
                $code: ""
            }
        } */

    User.findOne({ email: req.session.email }, (err, user) => {
        if(err) console.log(err);
        else if(user === null) res.status(200).json({ 
            success: false,
            isLogined: false
        });
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
        #swagger.path = '/subject/get/mySubjects' */
    User.findOne({ email: req.session.email }).populate('subjects').exec((err, user)=>{
        if(err) res.status(500).json(err);
        else {
            res.status(200).json({
                subjects: user.subjects
            });
        }
    });
});

// 곧 있을 수업 정보 받아오기

router.get('/get/upcomingLecture', auth, (req, res) => {
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/get/upcomingLecture' */
    if (!req.session.isLogined) res.status(401).json({
        success: false
    });
    
    User.findOne({ email: req.session.email }).populate('subjects').exec((err, user)=>{
        if (err) res.status(500).json(err);
        else {
            let minDiff = 60 * 24;
            let existUpcomingLecture = false;
            let existInProgressLecture = false;
            let upcomingLecture;

            const today = moment();

            const nowDay = today.day();
            const nowHour = today.hours();
            const nowMin = today.minutes();

            user.subjects.some((subject)=>{
                subject.days.some((day, dayIndex)=>{
                    if (day == nowDay) {
                        const startTime = subject.start_time[dayIndex].split(':');
                        const endTime = subject.end_time[dayIndex].split(':');

                        const startHourDiff = (startTime[0] - nowHour);
                        const endHourDiff = (endTime[0] - nowHour);
                        const startMinuteDiff = (startTime[1] - nowMin);
                        const endMinuteDiff = (endTime[1] - nowMin);

                        const startTimeDiff = startHourDiff * 60 + startMinuteDiff;
                        const endTimeDiff = endHourDiff * 60 + endMinuteDiff;

                        console.log(startTime, endTime);
                        console.log(nowHour);
                        console.log(startHourDiff, endHourDiff);
                        console.log(startMinuteDiff, endMinuteDiff);
                        console.log(startTimeDiff, endTimeDiff);

                        if (endTimeDiff > 0) {
                            if (startTimeDiff < 0) {
                                res.status(200).json({
                                    inProgress: true,
                                    subject: subject._id,
                                    diffH: startHourDiff,
                                    diffM: startMinuteDiff
                                });

                                existInProgressLecture = true;
                                return true;
                            }

                            if (endTimeDiff < minDiff) {
                                minDiff = endTimeDiff;
                                upcomingLecture = subject._id;
                                existUpcomingLecture = true;
                            }
                        }
                    }
                });

                if (existInProgressLecture) return true;
            });
            if (!existInProgressLecture) {
                if (existUpcomingLecture) {
                    res.status(200).json({
                        upcoming: true,
                        subject: upcomingLecture._id,
                        diffH: minDiff / 60,
                        diffM: minDiff % 60
                    });
                }
                else {
                    res.status(200).json({
                        upcoming: false
                    })
                }
            }
        }
    });
});

// 수업 시작하기

router.post('/lecture/start', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/lecture/start' */
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

// 해당 과목의 현재 진행중인 강의 참가

router.put('/lecture/join', auth, (req, res)=>{
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