const express = require('express');
const firebase = require('firebase');

const config = require('./../../../../config/config.js');

const router = express.Router();

/**
 * 特定のスクリーンにチェックインし、成功した場合そのスクリーンのstateを'checked_in'にする
 */
router.post('/', function (req, res) {
  try {
    firebase.app();
  } catch (error) {
    const firebaseConf = config.firebase.config;
    const firebaseServiceAccount = config.firebase.serviceAccount;
    const conf = Object.assign({}, firebaseConf, {serviceAccount: firebaseServiceAccount});
    firebase.initializeApp(conf);
  }
  const database = firebase.database();

  const requestBody = req.body;
  const paScreen = requestBody.screen;
  const paScreenToken = requestBody.screenToken;
  if (!paScreen || !paScreenToken) {
    res.status(400).json({
      error: 'Bad Request',
      errorMessage: `screen: ${paScreen}, screen_token: ${paScreenToken}`,
    });
    return;
  }

  const screenRef = database.ref(`screens/${paScreen}`);
  screenRef.once('value', snapshot => {
    const token = snapshot.val().token;
    if (!token) {
      res.status(400).json({error: 'Failed to authenticate'});
      return;
    }
    if (token === paScreenToken) {
      // トークンの称号ができたので書き込み可能
      screenRef.update({
        state: 'checked_in',
        grid1: '',
        grid2: '',
        grid3: '',
      });
      res.status(200).end();
    } else {
      res.status(400).json({error: 'invalid token'});
    }
  }, error => {
    console.log(error);
    res.status(400).json({error: 'Failed to connect to the database'});
    return;
  });
});


module.exports = router;