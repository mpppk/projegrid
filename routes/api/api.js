const express = require('express');
const router = express.Router();

const screen = require('./screen/api.js');
const user = require('./user/api.js');

router.use('/screen', screen);
router.use('/user', user);

module.exports = router;