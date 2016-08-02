const express = require('express');
const firebase = require('firebase');

const config = require('./../../../../config/config.js');

const router = express.Router();

/**
 * 特定のスクリーンからチェックアウトする
 */
router.post('/', function (req, res) {
  // Firebase初期化
  try {
    firebase.app();
  } catch (error) {
    const firebaseConf = config.firebase.config;
    const firebaseServiceAccount = config.firebase.serviceAccount;
    const conf = Object.assign({}, firebaseConf, {serviceAccount: firebaseServiceAccount});
    firebase.initializeApp(conf);
  }
  const database = firebase.database();

  // リクエストボディのscreenとscreenTokenパラメータを取得
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
    // 管理者によるデータベースアクセスなので、paScreenの値さえ間違っていなければ
    // Ruleにかかわらず確実にsnapshotを参照可能
    const token = snapshot.val().token;
    if (!token) {
      res.status(400).json({error: 'Failed to authenticate'});
      return;
    }
    if (token !== paScreenToken) {
      // トークンがあっていない
      res.status(400).json({error: 'invalid token'});
    } else {
      // トークンの照合ができたのでチェックアウト
      // TODO トークンを新しく生成して設定する
      screenRef.update({
        state: null,
        grid1: '',
        grid2: '',
        grid3: '',
      });
      res.status(200).end();
    }
  }, error => {
    // データベース接続に失敗
    // おそらくscreenの指定が間違っている
    console.log(error);
    res.status(400).json({error: 'Failed to connect to the database'});
    return;
  });
});


module.exports = router;