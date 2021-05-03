const express = require('express');
const router = express.Router();

const { LectureNote } = require('../models/models');
const { User } = require('../models/users');
const { Subject } = require('../models/subjects');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.get('/get/subject/:id', auth, (req, res)=>{
     /*  #swagger.tags = ['LectureNote']
        #swagger.path = '/lectureNote/get/subject/{id}' 
        #swagger.responses[200] = {
            description: 'success, lectureNotes 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        } */
    LectureNote.find({ subject: req.params.id }).sort({date: -1}).exec((err, lectureNotes)=>{
        if (err) return res.status(500).json(err);

        const lectureNoteArray = [];

        lectureNotes.forEach((lectureNote)=>{
            const lectureNoteForm = {
                id: lectureNote._id,
                title: lectureNote.title,
                content: lectureNote.content,
                fileURL: lectureNote.fileURL,
                date: lectureNote.date,
                feedLength: lectureNote.feed.length
            }
            lectureNoteArray.push(lectureNoteForm);
        })

        res.status(200).json({
            success: true,
            lectureNotes: lectureNoteArray
        })
    })
})

router.get('/get/:id', auth, (req, res)=>{
     /*  #swagger.tags = ['LectureNote']
        #swagger.path = '/lectureNote/get/{id}' 
        #swagger.responses[200] = {
            description: 'success, lectureNote 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[404] = {
            description: '해당하는 강의노트가 존재하지 않을 경우'
        } */
    lectureNote.findOne({ _id: req.params.id }).populate('subject')
    .populate('user').exec((err, lectureNote)=>{
        if (err) return res.status(500).json(err);
        if (lectureNote === null) return res.status(404).json({
            success: false,
            existLectureNote: false
        })

        res.status(200).json({
            success: true,
            lectureNote: lectureNote
        })
    })
})

router.post('/create', professorAuth, (req, res)=>{
     /*  #swagger.tags = ['LectureNote']
        #swagger.path = '/lectureNote/create' 
        #swagger.responses[200] = {
            description: 'success, lectureNote 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
        } */
    const lectureNote = new lectureNote({
        subject: req.body.subject,
        title: req.body.title,
        content: req.body.content,
        fileURL: req.body.fileURL,
        date: moment()
    });
    lectureNote.save((err, doc)=>{
        if (err) return res.status(500).json(err);

        res.status(201).json({
            success: true,
            lectureNote: doc
        })
    })
})

module.exports = router;