const express = require('express');
const router = express.Router();
const { Professor, Student } = require('../models/users');

const sendSession = (req, res, user) => {
    const type = (user === Professor) ? 'professor' : 'student';

    req.session.isLogined = true;
    req.session.name = user.name;
    req.session.email = user.email;
    req.session.type = type;

    res.status(200).json({ session: req.session });
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
                    res.status(200).json({ userExist: false });
                }
                else sendSession(req, res, professor);
            });
        }
        else sendSession(req, res, student);
    })
});

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
    if (userType === Professor) {
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