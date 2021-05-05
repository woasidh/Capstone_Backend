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
        #swagger.description = 'lecture의 status는 inProgress/done으로 나뉨'
        #swagger.responses[201] = {
            description: '성공적으로 수업을 시작한 경우',
            schema: {
                success: true,
                lecture: {
                    date: 2021-05-05,
                    status: 'inProgress',
                    start_time: '11:00',
                    subject: 0,
                    options: {
                        subtitle: false,
                        record: false,
                        attendance: false,
                        limit: 5
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'subjectId, 옵션만 지정하면 나머지는 기본 값으로 할당되어 저장됨',
            schema: {
                $subjectId: 0,
                $options: {
                    $subtitle: false,
                    $record: false,
                    $attendance: false,
                    $limit: 5
                }
            }
        } */
    Subject.findOne({ _id: req.body.subjectId }, (err, subject)=>{
        if (err) return res.status(500).json(err);

        const today = moment();

        const lecture = new Lecture({
            date: today.format('YYYY-MM-DD'),
            status: 'inProgress',
            start_time: today.format('HH:mm'),
            subject: subject._id,
            options: {
                subtitle: req.body.subtitle,
                record: req.body.record,
                attendance: req.body.attendance,
                limit: req.body.limit
            }
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
            description: 'success, lecture 객체 반환',
            schema: {
                success: true,
                lecture: {
                    date: 2021-05-05,
                    status: 'done',
                    start_time: '11:00',
                    end_time: '12:00',
                    subject: 0,
                    options: {
                        subtitle: false,
                        record: false,
                        attendance: false,
                        limit: 5
                    },
                    students: [{
                        student: 0,
                        attendance: true
                    }]
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
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
        end_time: moment().format('HH:mm'),
        chatting: req.body.chatting,
        question: questionIdArr
    }, { new: true }, (err, lecture)=>{
        if (err) return res.status(500).json(err);

        const lectureForm = {
            date: lecture.date,
            status: lecture.status,
            start_time: lecture.start_time,
            end_time: lecture.end_time,
            subject: lecture.subject,
            options: lecture.options,
            students: lecture.students
        }
        res.status(200).json({
            success: true,
            lecture: lectureForm
        });
    })
});

// 현재 진행중인 수업이 있는지 확인
router.put('/get/inProgress', auth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/get/inProgress' 
        #swagger.description = '현재 진행중인 수업이 있으면 어떤 수업이든 받아오기',
        #swagger.responses[200] = {
            description: '진행중인 수업이 있는 경우,
            \n진행중인 수업이 없는 경우',
            schema: {
                있음: {
                    success: true,
                    lectures: [{
                        _id: 0,
                        date: 2021-05-05,
                        status: 'inProgress',
                        start_time: '11:00',
                        end_time: '',
                        subject: 0,
                        options: {
                            subtitle: false,
                            record: false,
                            attendance: false,
                            limit: 5
                        },
                        students: [],
                        chatting: [],
                        questions: []
                    },
                    {
                        _id: 2,
                        date: 2021-05-05,
                        status: 'inProgress',
                        start_time: '11:30',
                        end_time: '',
                        subject: 1,
                        options: {
                            subtitle: true,
                            record: true,
                            attendance: true,
                            limit: 10
                        },
                        students: [],
                        chatting: [],
                        questions: []
                    }]
                },
                없음: {
                    success: false,
                    existInProgressLecture: false
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
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
            description: '해당 과목에 현재 진행중인 수업이 있을 경우
                \n해당 과목에 현재 진행중인 수업이 없을 경우',
            schema: {
                있음: {
                    success: true,
                    lecture: {
                        _id: 0,
                        date: 2021-05-05,
                        status: 'inProgress',
                        start_time: '11:00',
                        end_time: '',
                        subject: 0,
                        options: {
                            subtitle: false,
                            record: false,
                            attendance: false,
                            limit: 5
                        },
                        students: [],
                        chatting: [],
                        questions: []
                    }
                },
                없음: {
                    success: false,
                    existInProgressLecture: false
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        } */
    Subject.findOne({ _id: req.body.subjectId }).populate('lectures').exec((err, subject)=>{
        if (err) res.status(500).json(err);

        for (let i = subject.lectures.length; i >= 0; i--) {
            if (subject.lectures[i].status === 'inProgress') {
                return res.status(200).json({
                    success: true,
                    lecture: subject.lectures[i]
                });
            }
        }

        res.status(200).json({
            success: false,
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
            description: '수업에 정상적으로 참가한 경우',
            schema: {
                success: true,
                lecture: {
                    _id: 0,
                    date: 2021-05-05,
                    status: 'inProgress',
                    start_time: '11:00',
                    end_time: '',
                    subject: 0,
                    options: {
                        subtitle: false,
                        record: false,
                        attendance: false,
                        limit: 5
                    },
                    student: [{
                        student: 0,
                        attendance: true
                    }],
                    chatting: [],
                    questions: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[404] = {
            description: '해당하는 lectureId의 lecture가 존재하지 않음',
            schema: {
                success: false,
                existLecture: false
            }
        }
        #swagger.responses[409] = {
            description: '해당 lecture는 진행 중이지 않음',
            schema: {
                success: false,
                isInProgress: false
            }
        }
    */
    Lecture.findOne({ _id: req.params.id }).populate('students').exec((err, lecture)=>{
        if (err) return res.status(500).json(err);
        if (lecture === null) return res.status(404).json({
            success: false,
            existLecture: false
        });
        if (lecture.status === 'done') return res.status(409).json({
            success: false,
            isInProgress: false
        });

        lecture.students.push({
            student: req.session._id,
            attendance: !lecture.options.attendance
        });
        lecture.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({
                success: true,
                lecture
            })
        })
    })
})

module.exports = router