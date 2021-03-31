const express = require('express');
const router = express.Router();
const { User } = require('../models/users');

// 로그인

router.post('/login', (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/login'
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '유저가 없으면 userExist : false 반환',
            schema: { $email: "kkimbj18@ajou.ac.kr" }
        } */
        console.log(JSON.stringify({"cookies" : req.cookies}));
        console.log(JSON.stringify({"header" : req.headers }));

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) console.log(err);
        else if (user === null) {
            res.status(200).json({ userExist: false });
        }
        else {
            req.session.isLogined = true;
            req.session.name = user.name;
            req.session.email = user.email;
            req.session.type = user.type;

            req.session.save(()=>{
                res.status(200).json({
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
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '
                200 - 유저가 이미 존재하면 userExist : true, success : false 반환,
                \n200 - 성공적으로 회원가입 성공시, success : true 반환',
            schema: { $ref: "#/definitions/signUp" }
        } */
    let newUser = {};
    newUser = new User({
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
                if (err) res.json(err);
                if (user) {
                    res.status(200).json({
                        success: false,
                        userExist: true
                    });
                }
            });
            res.json(err);
        }
        else res.status(200).json({ success: true });
    });
});

router.get("/logout", function (req, res, next) {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/logout' 
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '200 - 성공적으로 로그아웃 성공시, success : true 반환'
        }*/
    req.session.destroy();
    res.clearCookie('sid');

    res.status(200).json({
        success: true
    })
})

module.exports = router;