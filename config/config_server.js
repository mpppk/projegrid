/**
 * サーバーで利用するユーザーに公開すべきでない項目を含む設定
 */

const config = require('./config_common.js');

module.exports = {
  firebase: {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    databaseURL: config.firebase.databaseURL,
    serviceAccount: {
      projectId: config.firebase.projectId,
      clientEmail: '' || process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      privateKey: '' || process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
    },
  },
};