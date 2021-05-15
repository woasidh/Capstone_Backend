const express = require('express');
const router = express.Router();

const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
const { Lecture } = require('../models/subjects');
const { Subtitle } = require('../models/models');
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
                isSubtitleAvailable: false
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'socket으로 받아온 정보의 일부와 수업의 자막 허용 유무를 보내주면 됨',
            schema: {
                $lectureId: 0,
                content: '아잉',
                time: '18:00',
                subtitleOpt: true
            }
        } */
    Subtitle.findOne({ lecture: req.body.lectureId }, (err, subtitle)=>{
        if (err) return res.status(500).json(err);
        if (!req.body.subtitleOpt) return res.status(409).json({
            success: false,
            isSubtitleAvailable: false
        })

        const subtitleForm = {
            content: req.body.content,
            time: req.body.time
        }
        
        if (subtitle === null) {
            subtitle = new Subtitle({
                lecture: req.body.lectureId,
                contents: subtitleForm
            });
        }
        else {
            subtitle.contents.push(subtitleForm);
        }

        subtitle.save((err, doc)=>{
            if (err) return res.status(500).json(err);

            const promise = ()=>{
                return new Promise((resolve, reject)=>{
                    if (subtitle === null){
                        Lecture.findOne({ _id: req.body.lectureId }, (err, lecture)=>{
                            if (err) reject(err);
                            
                            lecture.subtitle = doc._id;
                            lecture.save((err)=>{
                                if (err) reject(err);

                                resolve();
                            })
                        })
                    }
                    else resolve();
                })
            }

            promise().then(()=>{
                res.status(200).json({
                    success: true
                })
            }).catch((err)=>{
                res.status(500).json(err);
            })
        })
    })
})

module.exports = router;