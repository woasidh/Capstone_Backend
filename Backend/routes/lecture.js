const express = require('express');
const router = express.Router();

const { Subject, Lecture } = require('../models/subjects');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// 수업 시작하기
router.post('/start', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/start' 
        #swagger.responses[201] = {
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
        if (err) return res.status(500).json(err);

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
            if (err) return res.status(500).json(err);

            subject.lectures.push(lecture._id);
            subject.save((err)=>{
                if (err) return res.status(500).json(err);

                res.status(201).json({
                    success: true,
                    lecture: lecture
                });
            });
        });
    })
});

// 수업 종료하기
router.put('/close', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/close' 
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
            schema: { $ref: "#/definitions/closeLecture" }
        } */
    let questionIdArr = [];
    
    req.body.question.forEach((q)=>{
        const question = new Question(q);

        question.save((err, doc)=>{
            if (err) return res.status(500).json(err);

            questionIdArr.push(doc._id);
        });
    });

    Lecture.findOneAndUpdate({ _id: req.body.lectureId }, {
        status: 'done',
        end_time: moment().format('hh:mm'),
        chatting: req.body.chatting,
        question: questionIdArr
    }, { new: true }, (err, lecture)=>{
        if (err) return res.status(500).json(err);

        res.status(200).json({
            success: true,
            lecture: lecture
        });
    })
});

// 현재 진행중인 수업이 있는지 확인
router.put('/get/inProgress', auth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/get/inProgress' 
        #swagger.description = '현재 진행중인 수업이 있으면 어떤 수업이든 받아오기',
        #swagger.responses[200] = {
            description: '진행중인 수업이 있으면, success, existInProgressLecture, lectures 배열 반환,
            \n없으면, success: false, existInProgressLecture: false 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
    */
    Lecture.find({ status: 'inProgress' }).populate('subject').exec((err, lectures)=>{
        if (err) return  res.status(500).json(err);

        let lectureList = [];

        lectures.forEach((lec)=>{
            if (lec.subject.students.includes(req.session._id))
                lectureList.push(lec);
        })

        if (!lectureList.length) {
            res.status(200).json({
                success: false,
                existInProgressLecture: false
            });
        }
        else {
            res.status(200).json({
                success: true,
                existInProgressLecture: true,
                lectures: lectureList
            });
        }
    });
});

// 해당 과목의 현재 진행중인 수업 받아오기
router.get('/get/inProgress/subject/:id', auth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/get/inProgress/subject/{id}' 
        #swagger.responses[200] = {
            description: '현재 진행중인 수업이 있을 경우, existInProgressLecture, lecture 객체 반환
                \n없을 경우, existInProgressLecture: false 반환'
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
        if (err) res.status(500).json(err);

        for (let i = subject.lectures.length; i >= 0; i--) {
            if (subject.lectures[i].status === 'inProgress') {
                res.status(200).json({
                    existInProgressLecture: true,
                    lecture: subject.lectures[i]
                });

                return;
            }
        }

        res.status(200).json({
            existInProgressLecture: false
        });
    });
});

// lectureId로 수업 참가
router.put('/join/:id', auth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/join/{id}' 
        #swagger.description = 'lectureId로 수업 참가',
        #swagger.responses[200] = {
            description: '진행중인 수업이 있으면, existLecture, lecture 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[404] = {
            description: '해당하는 lectureId의 lecture가 존재하지 않음'
        }
    */
    Lecture.findOne({ _id: req.params.id }).populate('students').exec((err, lecture)=>{
        if (err) return res.status(500).json(err);
        if (lecture === null) return res.status(404).json({
            success: false,
            existLecture: false
        });

        lecture.students.push({ student: req.session._id });
        lecture.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({
                success: true,
                existLecture: true,
                lecture
            })
        })
    })
})

module.exports = router