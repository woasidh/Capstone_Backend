const express = require('express');
const router = express.Router();
const { User } = require('../models/users');

// 로그인

router.post('/login', (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/login'
        #swagger.responses[200] = {
            description: '로그인 성공 시, success, userExist, session 객체 반환
                \n로그인 실패 시, success: false, userExist: false 반환'
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: { $email: "kkimbj18@ajou.ac.kr" }
        } */

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) return res.status(500).json(err);

        if (user === null) {
            res.status(200).json({ 
                success: false,
                userExist: false 
            });
        }
        else {
            req.session.isLogined = true;
            req.session.name = user.name;
            req.session.email = user.email;
            req.session.type = user.type;
            req.session._id = user._id;

            req.session.save(()=>{
                res.status(200).json({
                    success: true,
                    session: req.session,
                    userExist: true
                });
            });

            console.log({"session" : req.session});
        }
    });
});

// 회원가입

router.post('/signup', (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/signup'
        #swagger.responses[200] = {
            description: '성공적으로 회원가입 성공시 success'
        }
        #swagger.responses[409] = {
            description: '유저가 이미 존재할 때 userExist, success: false'
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: { $ref: "#/definitions/signUp" }
        } */
    const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        photourl: req.body.photourl,
        identityID: req.body.identityID,
        school: req.body.school,
        major: req.body.major,
        grade: req.body.grade,
        type: req.body.type
    });
    newUser.save((err) => {
        if (err) {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (err) return res.status(500).json(err);
                
                if (user) {
                    res.status(409).json({
                        success: false,
                        userExist: true
                    });
                }
                else res.status(400).json(err);
            });
        }
        else res.status(201).json({ success: true });
    });
});

router.get("/logout", function (req, res, next) {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/logout'
        #swagger.responses[200] = {
            description: '
                성공적으로 로그아웃 성공 시, success 반환
                \n로그인 상태 아닐 시, success: false, isLogined: false 반환'
        }
    */
    if (req.session.isLogined) {
        req.session.destroy();
        res.clearCookie('sid');

        res.status(200).json({
            success: true
        });
    }
    else { 
        res.status(200).json({
            success: false,
            isLogined: false
        });
    }
});

module.exports = router;