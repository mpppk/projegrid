const crypto = require('crypto');

/**
 * 暗号論的に安全なトークンを生成する
 * @return {Promise}
 */
function genToken() {
  return new Promise((resolve, reject)=> {
    crypto.randomBytes(32, (err, buf) => {
      if (err) {
        reject(err);
        return;
      }

      const hash = crypto.createHash('sha256');
      hash.update(buf);
      const token = hash.digest('hex');
      resolve(token);
    });
  });
}

module.exports = genToken;