const express = require('express');
const router = express.Router();
const { User } = require('../models/users');

const sendSession = (req, res, user) => {
    req.session.isLogined = true;
    req.session.name = user.name;
    req.session.email = user.email;
    req.session.type = user.type;

    res.status(200).json({
        session: req.session,
        userExist: true
    });
}

router.post('/login', (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/login'
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '유저가 없으면 userExist : false 반환'
        } */
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) console.log(err);
        else if (user === null) {
            res.status(400).json({ userExist: false });
        }
        else sendSession(req, res, user);
    })
});

router.post('/signup', (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/signup'
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'Grade is Number'
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
                if (err) console.log(err);
                if (user) {
                    res.status(400).json({
                        success: false,
                        userExist: true
                    });
                }
            });
            console.log(err);
        }
        else res.status(200).json({ success: true });
    });
});

router.get("/logout", function (req, res, next) {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/logout' */
    req.session.destroy();
    res.clearCookie('sid');

    res.status(200).json({
        success: true
    })
})

module.exports = router;