const express = require('express');
const firebase = require('firebase');

const config = require('./../../../../lib/config.js');

const router = express.Router();

/**
 * 特定のスクリーンからチェックアウトする
 */
router.post('/', function (req, res) {
  // Firebase初期化
  try {
    firebase.app();
  } catch (error) {
    firebase.initializeApp(config.firebase);
  }
  const database = firebase.database();

  // リクエストボディのscreenIdとsecretTokenパラメータを取得
  const requestBody = req.body;
  const paScreenId = requestBody.screenId;
  const paSecretToken = requestBody.secretToken;
  if (!paScreenId || !paSecretToken) {
    res.status(400).json({
      error: 'Bad Request',
      errorMessage: `screenId: ${paScreenId}, secretToken: ${paSecretToken}`,
    });
    return;
  }

  const screenRef = database.ref(`screens/${paScreenId}`);
  screenRef.once('value')
    .then(snapshot => {
      // 管理者によるデータベースアクセスなので、paScreenIdの値さえ間違っていなければ
      // Ruleにかかわらず確実にsnapshotを参照可能
      const secretToken = snapshot.val().secretToken;
      if (!secretToken) {
        // なぜかスクリーンのシークレットトークンが設定されていない
        res.status(400).json({error: 'Failed to authenticate'});
        return;
      }
      if (secretToken !== paSecretToken) {
        // トークンがあっていない (=現在チェックイン中ではないのでスクリーンの初期化はしない)
        res.status(400).json({error: 'invalid token'});
        return;
      }

      // トークンの照合ができたのでチェックアウト
      // スクリーンの初期化
      screenRef.update({
        state: null,
      });

      res.status(200).end();
    })
    .catch(error => {
      res.status(500).json({error: 'Something wrong'});
      console.log(error);
      return;
    });
});


module.exports = router;