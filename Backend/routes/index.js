var express = require('express');
var router = express.Router();

const { Student, Professor } = require('../models/users');

// 사용자 정보 불러오기
router.get('/', (req, res) => {
  if (!req.session.isLogined) {
    res.status(200).json({ login: false });
  }
  else {
    const userType = (req.session.type === 'student') ? Student : Professor;

    userType.findOne({ _id: req.session.id }).populate('subject').exec((err, user) => {
      if (err) console.log(err);
      else {
        res.status(200).json(user);
      }
    });
  }
});

module.exports = router;
