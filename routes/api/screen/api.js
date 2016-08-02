const express = require('express');
const router = express.Router();

const checkIn = require('./check_in/api.js');

router.use('/check_in', checkIn);

module.exports = router;