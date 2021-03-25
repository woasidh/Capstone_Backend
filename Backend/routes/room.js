const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { Subject } = require('../models/rooms');
const { User } = require('../models/users');

// 강의 개설
router.post('/create', (req, res) => {
    /*  #swagger.tags = ['Room']
        #swagger.path = '/room/create' 
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '성공시 success, code 반환, time과 days는 배열'
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

router.post('/join', (req, res) => {
    /*  #swagger.tags = ['Room']
        #swagger.path = '/room/join' 
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '성공시 success 반환'
        } */
    User.findOne({ email: req.session.email }, (err, user) => {
        if(err) console.log(err);
        else if(user === null) res.status(401).json({ 
            success: false,
            isLogined: false
        });
        Subject.findOne({ code: req.body.code }, (err, subject) => {
            if (err) console.log(err);
            else if (subject === null) res.status(403).json({ 
                success: false,
                codeValidation: false
            });
            else {
                if (user.subjects.includes(subject._id)) res.status(403).json({
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
                                res.status(200).json({ success: true });
                            }
                        });
                    }
                });
            }
        });
    });
});

router.get('/get', (req, res)=>{
    /*  #swagger.tags = ['Room']
        #swagger.path = '/room/get' */
    Subject.find({}).populate('students').exec((err, subject)=>{
        if(err) console.log(err);
        else {
            res.status(200).json(subject);
        }
    });
})

module.exports = router;