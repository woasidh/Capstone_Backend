const express = require('express');
const router = express.Router();

const { Understanding } = require('../models/models');
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
    const understanding = new Understanding({
        type: req.body.type,
        name: req.body.name,
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
        #swagger.responses[201] = {
            description: '이해도평가가 정상적으로 제출된 경우',
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
                $udId: 0,
                response: ['O']
            }
        } */
    const now = moment();

    Understanding.findOne({ _id: req.body.udId }, (err, ud)=>{
        if (err) return res.status(500).json(err);
        if (ud.status === 'done') {
            return res.status(409).json({
                success: false,
                isOver: true
            });
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

module.exports = router;