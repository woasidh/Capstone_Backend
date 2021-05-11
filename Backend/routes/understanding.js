const express = require('express');
const router = express.Router();

const { UnderstandingStu, UnderstandingPro } = require('../models/models');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.post('/create', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Understanding']
        #swagger.path = '/understanding/create' 
        #swagger.description = 'status는 open/done으로 나뉨'
        #swagger.responses[201] = {
            description: '이해도평가가 정상적으로 생성된 경우',
            schema: {
                success: true,
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
                $name: '중간이해도평가',
                $lectureId: 0,
                $type: 'OX',
            }
        } */
    const understanding = new UnderstandingPro({
        type: req.body.type,
        name: req.body.name,
        date: new moment(),
        status: 'open',
        lecture: req.body.lectureId
    });

    understanding.save((err)=>{
        if (err) return res.status(500).json(err);

        res.status(201).json({
            success: true
        })
    })
})

router.put('/submit', auth, (req, res)=>{
    /*  #swagger.tags = ['Understanding']
        #swagger.path = '/understanding/submit' 
        #swagger.description = 'status는 open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '이해도평가가 정상적으로 제출된 경우',
            schema: {
                success: true,
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[404] = {
            description: 'udId에 해당하는 이해도평가가 존재하지 않는 경우',
            schema: {
                success: false,
                existUd: false
            }
        }
        #swagger.responses[409] = {
            description: '이해도평가가 이미 종료된 경우',
            schema: {
                success: false,
                isOver: false
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $udId: 0,
                response: ['O']
            }
        } */
    const now = moment();

    UnderstandingPro.findOne({ _id: req.body.udId }, (err, ud)=>{
        if (err) return res.status(500).json(err);
        if (ud.status === 'done') {
            return res.status(409).json({
                success: false,
                isOver: true
            });
        }
        if (ud === null) {
            return res.status(404).json({
                success: false,
                existUd: false
            })
        }

        ud.responses.push({
            date: now,
            student: req.session._id,
            response: req.body.response
        });
        ud.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({
                success: true
            })
        })
    })
})

router.put('/close/:id', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Understanding']
        #swagger.path = '/understanding/close/{id}' 
        #swagger.description = 'status는 open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '이해도평가가 정상적으로 종료되었을 경우',
            schema: {
                success: true,
                understanding: {
                    type: 'OX',
                    name: '중간이해도평가',
                    date: '2021-05-05T15:38:19.424Z',
                    deadLine: '2021-05-05T16:00:00.000Z',
                    status: 'done',
                    lecture: 0,
                    responses: [{
                        student: 0,
                        response: 'O',
                        date: '2021-05-05T15:40:48.473Z'
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
        } */
    UnderstandingPro.findOneAndUpdate({ _id: req.params.udId }, {
        status: 'done',
        deadLine: new moment()
    }, { new: true }, (err, ud)=>{
        if (err) return res.status(500).json(err);

        res.status(200).json({
            success: true,
            understanding: ud
        });
    })
});

router.post('/send', auth, (req, res)=>{
    /*  #swagger.tags = ['Understanding']
        #swagger.path = '/understanding/send' 
        #swagger.description = '학생이 주도적으로 교수님에게 "이해 안됨" 표시를 날릴 때 정보를 저장해주는 API'
        #swagger.responses[201] = {
            description: '학생의 이해 여부가 정상적으로 생성된 경우',
            schema: {
                success: true,
                understanding: {
                    student: 0,
                    lecture: 0,
                    response: false,
                    time: '0:23'
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
                $isUnderstood: false,
                $lectureId: 0,
                $lectureStartTime: '12:00',
            }
        } */
    const now = moment();
    const currHour = now.hours();
    const currMinute = now.minutes();

    const startTime = req.body.lectureStartTime.split(":");
    const startHour = Number(startTime[0]);
    const startMinute = Number(startTime[1]);

    let hours;
    let minutes;
    let understandingForm = {};

    const needBorrowing = currMinute-startMinute < 0 

    if (needBorrowing) {
        hours = (currHour-startHour-1);
        minutes = (currMinute-startMinute+60);
    }
    else {
        hours = (currHour-startHour);
        minutes = (currMinute-startMinute);
    }
    
    const time = hours + ":" + minutes;

    const understanding = new UnderstandingStu({
        student: req.session._id,
        lecture: req.body.lectureId,
        response: req.body.isUnderstood,
        hours: hours,
        minutes: minutes
    });
    understanding.save((err, ud)=>{
        if (err) return res.status(500).json(err);

        understandingForm = {
            student: ud._id,
            lecture: ud.lecture,
            response: ud.response,
            time: time
        }
    });

    
})

module.exports = router;