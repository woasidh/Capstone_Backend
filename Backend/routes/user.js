const express = require('express');
const router = express.Router();
const { User } = require('../models/users');

router.get('/get/student', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/student'
    User.find({ type: 'student' }).populate('subject').exec((err, students) => {
        if(err) res.status(500).json({ success: false });
        else {
            res.status(200).json(students);
        }
    });
});

router.get('/get/professor', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/professor'
    User.find({ type: 'professor' }).populate('subject').exec((err, professors) => {
        if(err) res.status(500).json({ success: false });
        else {
            res.status(200).json(professors);
        }
    });
});

router.get('/get', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get'
    User.find({}).populate('subject').exec((err, users) => {
        if(err) res.status(500).json({ success: false });
        else {
            res.status(200).json(users);
        }
    });
});

module.exports = router;