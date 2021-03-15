const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { Professor, Student } = require('../models/users');

const sendSession = (type) => {
    req.session = {
        name: user.name,
        email: user.email,
        type: type
    }
    res.status(200).json({session: req.session});
}

const googleCallback = (req, res) => {
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
                else sendSession('professor');
            });
        }
        else sendSession('student');
    })
}

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google'), googleCallback
);

router.post('/signup', (req, res) => {
    const userType = (req.body.type === 'professor') ? Professor : Student;
    const user = new userType({
        name: req.body.name,
        id: req.body.id,
        email: req.body.email
    });
    user.save((err) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
        }
        else res.status(200).json({ success: true });
    });
});

module.exports = router;