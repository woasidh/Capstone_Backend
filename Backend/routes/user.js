const express = require('express');
const router = express.Router();
const { User } = require('../models/users');

router.get('/get/student', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/student'
    User.find({ type: 'student' }).populate('subject').exec((err, students) => {
        if(err) console.log(err);
        else {
            res.status(200).json(students);
        }
    });
});

router.get('/get/professor', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/professor'
    User.find({ type: 'professor' }).populate('subject').exec((err, professors) => {
        if(err) console.log(err);
        else {
            res.status(200).json(professors);
        }
    });
});

router.get('/get', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get'
    User.find({}).populate('subject').exec((err, users) => {
        if(err) console.log(err);
        else {
            res.status(200).json(users);
        }
    });
});

router.get('/get/current', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/current'
    User.findOne({ email: req.session.email }).populate('subject').exec((err, user) => {
        if(err) console.log(err);
        else {
            res.status(200).json(user);
        }
    });
});

module.exports = router;