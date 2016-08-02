const express = require('express');
const router = express.Router();

const checkIn = require('./check_in/api.js');
const checkOut = require('./check_out/api.js');

router.use('/check_in', checkIn);
router.use('/check_out', checkOut);

module.exports = router;