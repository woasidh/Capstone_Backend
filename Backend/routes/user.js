const express = require('express');
const router = express.Router();
const { User } = require('../models/users');

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