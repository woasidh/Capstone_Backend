const express = require('express');
const router = express.Router();
// const passport = require('../config/passport');
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

router.post('/login', (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/login'
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '유저가 없으면 userExist : false 반환'
        }
    */
    Student.findOne({
        email: req.body.email
    }, (err, student) => {
        if (err) console.log(err);
        else if (student === null) {
            Professor.findOne({
                email: req.body.email
            }, (err, professor) => {
                if (err) console.log(err);
                else if (professor === null) {
                    res.status(200).json({ userExist : false });
                }
                else sendSession(req, 'professor');
            });
        }
        else sendSession(req, 'student');
    })
});

// router.get('/google',
//     // #swagger.tags = ['Auth']
//     // #swagger.path = '/auth/google'
//     passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// router.get('/google/callback',
//     // #swagger.tags = ['Auth']
//     // #swagger.path = '/auth/google/callback'
//     passport.authenticate('google'), googleCallback
// );

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
            email: req.body.email,
            name: req.body.name,
            photourl: req.body.photourl,
            professorID: req.body.professorID,
            school: req.body.school,
            major: req.body.major
        });
    }
    else {
        user = new userType({
            email: req.body.email,
            name: req.body.name,
            photourl: req.body.photourl,
            studentID: req.body.studentID,
            school: req.body.school,
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