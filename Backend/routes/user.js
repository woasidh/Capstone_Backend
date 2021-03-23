const express = require('express');
const router = express.Router();
const { Professor, Student } = require('../models/users');

router.get('/get/student', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/student'
    Student.find({}).populate('subject').exec((err, users) => {
        if(err) res.status(500).json({ success: false });
        else {
            res.status(200).json(users);
        }
    });
});

router.get('/get/professor', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/professor'
    Professor.find({}).populate('subject').exec((err, users) => {
        if(err) res.status(500).json({ success: false });
        else {
            res.status(200).json(users);
        }
    });
});

module.exports = router;