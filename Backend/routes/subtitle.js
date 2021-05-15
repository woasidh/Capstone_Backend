const express = require('express');
const router = express.Router();

const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
const { Lecture } = require('../models/subjects');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.put('/add', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Subtitle']
        #swagger.path = '/subtitle/add' 
        #swagger.description = '기존 수업 전체의 자막에 내용을 추가하는 API'
        #swagger.responses[200] = {
            description: '성공적으로 자막을 추가하였을 경우',
            schema: {
                success: true
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
        #swagger.responses[409] = {
            description: '수업의 자막 설정이 false인 경우',
            schema: {
                success: false,
                subtitleOpt: false
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'socket으로 받아온 정보의 일부를 다시 보내주면 됨',
            schema: {
                $lectureId: 0,
                content: '아잉',
                time: '18:00'
            }
        } */
    Lecture.findOne({ _id: req.body.lectureId }, (err, lecture)=>{
        if (err) return res.status(500).json(err);
        if (lecture.options.subtitle) return res.status(409).json({
            success: false,
            subtitleOpt: false
        })

        lecture.subtitles.push({
            content: req.body.content,
            time: req.body.time
        });
        lecture.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({
                success: true
            })
        })
    })
})

module.exports = router;