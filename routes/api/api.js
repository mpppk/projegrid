const express = require('express');
const router = express.Router();

const screen = require('./screen/api.js');

router.use('/screen', screen);

module.exports = router;