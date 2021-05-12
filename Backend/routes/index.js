var express = require('express');
var router = express.Router();

const { User } = require('../models/users');

router.get('/', (req, res) => {
  res.status(200).send('흐에');
});

module.exports = router;
