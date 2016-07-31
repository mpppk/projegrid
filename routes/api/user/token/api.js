const crypto = require('crypto');

const express = require('express');
const router = express.Router();

/**
 * チェックインするユーザーの認証に使うトークンを生成しDBに設定する
 */
router.post('/', function (req, res) {
  crypto.randomBytes(32, (err, buf) => {
    if (err) res.json({token: ''});

    const hash = crypto.createHash('sha256');
    hash.update(buf);
    const token = hash.digest('hex');
    res.json({token: token});
  });
});

module.exports = router;