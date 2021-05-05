const express = require('express');
const router = express.Router();

const { Notice } = require('../models/models');
const { User } = require('../models/users');
const { Subject } = require('../models/subjects');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.get('/get/all', auth, (req, res)=>{
     /*  #swagger.tags = ['Notice']
        #swagger.path = '/notice/get/all' 
        #swagger.description = '해당 사용자가 수강하는 모든 과목들에서 최근 3개의 공지사항들을 받아오기',
        #swagger.responses[200] = {
            description: '정상적으로 공지사항들을 모두 받아온 경우',
            schema: {
                success: true,
                notices: [{
                    _id: 0,
                    subject: {
                        name: '캡스톤디자인',
                        start_period: '2021-03-02',
                        end_period: '2021-06-30',
                        start_time: ['16:30', '18:00', '19:30'],
                        end_time: ['18:00', '19:30', '21:00'],
                        days: [1, 1, 1],
                        code: '519hi32hkjifb12',
                        lectures: [],
                        students: [0],
                        introURL: ''
                    },
                    title: '중간발표 5월 20일 ㅋㅋ',
                    content: '제발 동영상만 내세요! PPT 필요 없습니다!',
                    date: '2021-05-05T15:38:19.424Z',
                    comments: [],
                    emotions: []
                }]
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        } */
    User.findOne({ _id: req.session._id }, (err, user)=>{
        if (err) return res.status(500).json(err);

        const noticeArray = [];

        user.subjects.forEach((subject)=>{
            Notice.find({ subject: subject }).populate('subject').sort({date: -1}).exec((err, notices)=>{
                if (err) return res.status(500).json(err);

                notices = notices.splice(0, 3);
                
                notices.forEach((notice)=>{
                    noticeArray.push(notice);
                });
            });
        });

        res.status(200).json({
            success: true,
            notices: noticeArray
        })
    })
})

router.get('/get/subject/:id', auth, (req, res)=>{
     /*  #swagger.tags = ['Notice']
        #swagger.path = '/notice/get/subject/{id}' 
        #swagger.responses[200] = {
            description: '정상적으로 해당 subject에 포함된 모든 공지사항들을 받아온 경우',
            schema: {
                success: true,
                notices: [{
                    id: 0,
                    title: '중간발표 5월 20일 ㅋㅋ',
                    content: '제발 동영상만 내세요! PPT 필요 없습니다!',
                    date: '2021-05-05T15:38:19.424Z',
                    comments: [],
                    emotions: []
                }]
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        } */
    Notice.find({ subject: req.params.id }).sort({date: -1}).exec((err, notices)=>{
        if (err) return res.status(500).json(err);

        const noticeArray = [];

        notices.forEach((notice)=>{
            const noticeForm = {
                id: notice._id,
                title: notice.title,
                content: notice.content,
                date: notice.date,
                comments: notice.comments,
                emotions: notice.emotions
            }
            noticeArray.push(noticeForm);
        })

        res.status(200).json({
            success: true,
            notices: noticeArray
        })
    })
})

router.get('/get/:id', auth, (req, res)=>{
     /*  #swagger.tags = ['Notice']
        #swagger.path = '/notice/get/{id}' 
        #swagger.responses[200] = {
            description: '정상적으로 해당 id의 공지사항을 받아온 경우',
            schema: {
                success: true,
                notice: {
                    _id: 0,
                    subject: {
                        _id: 0,
                        name: '캡스톤디자인',
                        start_period: '2021-03-02',
                        end_period: '2021-06-30',
                        start_time: ['16:30', '18:00', '19:30'],
                        end_time: ['18:00', '19:30', '21:00'],
                        days: [1, 1, 1],
                        code: '519hi32hkjifb12',
                        lectures: [],
                        students: [0],
                        introURL: ''
                    },
                    title: '중간발표 5월 20일 ㅋㅋ',
                    content: '제발 동영상만 내세요! PPT 필요 없습니다!',
                    date: '2021-05-05T15:38:19.424Z',
                    comments: [{
                        user: {
                            _id: 0,
                            name: '김민건',
                            email: 'kkimbj18@ajou.ac.kr',
                            photourl: '',
                            school: '아주대학교',
                            identityID: '201620912',
                            major: '소프트웨어학과',
                            type: 'student',
                            subject: [0,1,2,3]
                        },
                        content: '오 쉣 ㅋㅋㅋㅋ 무냐구~~~~',
                        date: '2021-05-05T15:38:19.424Z'
                    }],
                    emotions: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[404] = {
            description: '해당하는 공지가 존재하지 않을 경우',
            schema: {
                success: false,
                existNotice: false
            }
        } */
    Notice.findOne({ _id: req.params.id }).populate('subject')
    .populate('user').exec((err, notice)=>{
        if (err) return res.status(500).json(err);
        if (notice === null) return res.status(404).json({
            success: false,
            existNotice: false
        })

        res.status(200).json({
            success: true,
            notice: notice
        })
    })
})

router.post('/create', professorAuth, (req, res)=>{
     /*  #swagger.tags = ['Notice']
        #swagger.path = '/notice/create' 
         #swagger.responses[201] = {
            description: '정상적으로 공지를 생성했을 경우',
            schema: {
                success: true,
                notice: {
                    _id: 0,
                    subject: 0,
                    title: '오늘은 여기까지만...',
                    content: '힘들드아',
                    date: '2021-05-05T15:38:19.424Z',
                    comments: [],
                    emotions: []
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
            schema: {
                subject: 0,
                title: '오늘은 여기까지만...',
                content: '힘들드아',
            }
        } */
    const notice = new Notice({
        subject: req.body.subject,
        title: req.body.title,
        content: req.body.content,
        date: moment()
    });
    notice.save((err, doc)=>{
        if (err) return res.status(500).json(err);

        res.status(201).json({
            success: true,
            notice: doc
        })
    })
})

module.exports = router;