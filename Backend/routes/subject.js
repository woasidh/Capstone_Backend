const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { Subject } = require('../models/subjects');
const { User } = require('../models/users');

// 강의 개설

router.post('/create', (req, res) => {
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/create' 
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '
                성공시 success, code 반환, time과 days는 배열, days는 1부터 7까지 월요일부터 일요일을 의미
                \n403 - type이 professor가 아닌 경우,
                \n401 - user가 로그인이 되지 않은 경우,
                \n200 - success : true, code 반환',
            schema: { $ref: "#/definitions/createSubject" }
        } */
    const salt = Math.round((new Date().valueOf() + Math.random())) + "";
    const hashCode = crypto.createHash("sha512").update(salt).digest('hex').slice(0, 16);

    if(!req.session.isLogined) res.status(401).json({
        success: false
    });

    else {
        User.findOne({ email: req.session.email }, (err, user) => {
            if(user.type != 'professor') res.status(403).json({ 
                success: false,
            });
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
    }
});

// 강의 방 참가

router.post('/join', (req, res) => {
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
    if(!req.session.isLogined) res.status(401).json({
        success: false
    });

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

// 전체 subjects 객체들 반환

router.get('/get', (req, res)=>{
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/get' */
    Subject.find({}).populate('students').exec((err, subjects)=>{
        if(err) res.status(500).json(err);
        else {
            res.status(200).json(subjects);
        }
    });
});

module.exports = router;