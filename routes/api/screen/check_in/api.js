const express = require('express');
const firebase = require('firebase');

const genToken = require('./../../../../lib/token.js');
const config = require('./../../../../lib/config.js');

const router = express.Router();

/**
 * 特定のスクリーンにチェックインし、成功した場合そのスクリーンのstateを'checked_in'にする
 */
router.post('/', function (req, res) {
  // Firebase初期化
  try {
    firebase.app();
  } catch (error) {
    firebase.initializeApp(config.firebase);
  }
  const database = firebase.database();

  // リクエストボディのscreenとscreenTokenパラメータを取得
  const requestBody = req.body;
  const paScreen = requestBody.screen;
  const paScreenToken = requestBody.screenToken;
  const paUser = requestBody.user;
  if (!paScreen || !paScreenToken || !paUser) {
    // リクエストボディの形式が間違っている
    res.status(400).json({
      error: 'Bad Request',
      errorMessage: `screen: ${paScreen}, screen_token: ${paScreenToken}, user: ${paUser}`,
    });
    return;
  }

  const screenRef = database.ref(`screens/${paScreen}`);
  const userRef = database.ref(`users/${paUser}`);
  screenRef.once('value')
    .then(snapshot => {
      // 管理者によるデータベースアクセスなので、paScreenの値さえ間違っていなければ
      // Ruleにかかわらず確実にsnapshotを参照可能
      const dbData = snapshot.val();

      const token = dbData.token;
      if (!token) {
        // なぜかスクリーンにトークンが設定されていない
        res.status(400).json({error: 'Failed to authenticate'});
        return;
      }

      if (token !== paScreenToken) {
        // トークンがあっていない
        res.status(400).json({error: 'invalid token'});
        return;
      }
      // トークンの照合ができたのでここからスクリーンに書き込み可能
    })
    .catch(error => {
      // データベース接続に失敗
      // おそらくscreenの指定が間違っている
      res.status(400).json({error: 'Failed to connect to the database'});
      return;
    })
    .then(() => {
      // トークンを新しく生成
      return Promise.all([genToken(), genToken()]);
    })
    .then(tokens => {
      const token = tokens[0];
      const secretToken = tokens[1];

      // DB初期化
      screenRef.update({
        state: 'checked_in',
        token: token,
        secretToken: secretToken,
        grid1: '',
        grid2: '',
        grid3: '',
      });

      // secret tokenを設定
      userRef.update({
        screenToken: secretToken,
      });

      res.status(200).json({secretToken: secretToken});
      return;
    })
    .catch(error => {
      res.status(500).json({error: 'something wrong'});
      return;
    });
});


module.exports = router;