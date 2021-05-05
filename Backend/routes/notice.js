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
        #swagger.responses[200] = {
            description: 'success, notices 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        } */
    User.findOne({ _id: req.session._id }).populate('subject').exec((err, user)=>{
        if (err) return res.status(500).json(err);

        const noticeArray = [];

        user.subjects.forEach((subject)=>{
            Notice.find({ subject: subject }).sort({date: -1}).exec((err, notices)=>{
                if (err) return res.status(500).json(err);

                notices = notices.splice(0, 3);
                
                notices.forEach((notice)=>{
                    const noticeForm = {
                        id: notice._id,
                        subjectId: subject._id,
                        subjectName: subject.name,
                        title: notice.title,
                        content: notice.content,
                        date: notice.date,
                        feedLength: notice.feed.length
                    }
                    noticeArray.push(noticeForm);
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
        #swagger.path = '/notice/get/student/{id}' 
        #swagger.responses[200] = {
            description: 'success, notices 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
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
                feedLength: notice.feed.length
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
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[200] = {
            description: 'success, notice 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[404] = {
            description: '해당하는 공지가 존재하지 않을 경우'
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
        #swagger.responses[200] = {
            description: 'success, notice 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
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