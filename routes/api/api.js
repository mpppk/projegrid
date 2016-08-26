const express = require('express');
const router = express.Router();

const screen = require('./screen/api.js');
const token = require('./token/api.js');

router.use('/screen', screen);
router.use('/token', token);

module.exports = router;