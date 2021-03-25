var express = require('express');
var router = express.Router();

const { User } = require('../models/users');

// 사용자 정보 불러오기
router.get('/', (req, res) => {
  if (!req.session.isLogined) {
    res.status(200).json({ login: false });
  }
  else {
    User.findOne({ email: req.session.email }).populate('subject').exec((err, user) => {
      if (err) res.json(err);
      else {
        res.status(200).json(user);
      }
    });
  }
});

module.exports = router;
