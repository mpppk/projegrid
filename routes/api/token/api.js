const express = require('express');

const genToken = require('./../../../lib/token.js');

const router = express.Router();

router.get('/', function (req, res) {
  genToken()
    .then(token => {
      res.status(200).json({token: token});
    })
    .catch(err => {
      res.status(500).json({error: 'Failed to generate a token'});
      console.log(err);
    });
});

module.exports = router;