const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { Professor, Student } = require('../models/users');

const sendSession = (req, type) => {
    req.session = {
        isLogined: true,
        name: req.user.name,
        email: req.user.email,
        type: type
    }
    req.session.save(()=>{
        res.status(200).json({ session: req.session });
    });
}

const googleCallback = (req, res) => {
    if(req.user.email.split('@')[1] != 'ajou.ac.kr') {
        res.status(200).json({ success : false });
    }

    Student.findOne({
        id: req.user.id
    }, (err, user) => {
        if (err) console.log(err);
        else if (user === null) {
            Professor.findOne({
                id: req.user.id
            }, (err, user) => {
                if (err) console.log(err);
                else if (user === null) {
                    res.status(200).json({
                        id: req.user.id,
                        email: req.user.email,
                        name: req.user.displayName
                    });
                }
                else sendSession(req, 'professor');
            });
        }
        else sendSession(req, 'student');
    })
}

router.get('/google',
    // #swagger.tags = ['Auth']
    // #swagger.path = '/auth/google'
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    // #swagger.tags = ['Auth']
    // #swagger.path = '/auth/google/callback'
    passport.authenticate('google'), googleCallback
);

router.post('/signup', (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/signup'
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'Grade is Number'
        }
    */
    let user = {};
    const userType = (req.body.type === 'professor') ? Professor : Student;
    if(userType === Professor){
        user = new userType({
            name: req.body.name,
            _id: req.body.id,
            email: req.body.email,
            professorID: req.body.professorID,
            major: req.body.major
        });
    }
    else {
        user = new userType({
            name: req.body.name,
            _id: req.body.id,
            email: req.body.email,
            studentID: req.body.studentID,
            major: req.body.major,
            grade: req.body.grade
        });
    }
    user.save((err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false });
        }
        else res.status(200).json({ success: true });
    });
});

module.exports = router;