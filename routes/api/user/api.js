const express = require('express');
const router = express.Router();

const token = require('./token/api.js');

router.use('/token', token);

module.exports = router;