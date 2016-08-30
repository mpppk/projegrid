/**
 * ブラウザで利用するユーザーに公開可能な設定
 */

const firebaseProjectId = 'sample-5f412' || process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID;

module.exports = {
  firebase: {
    projectId: firebaseProjectId,
    apiKey: 'AIzaSyDNBvfpc07ND30lVfjcPYE6VddcVd237mQ',
    authDomain: firebaseProjectId + '.firebaseapp.com',
    databaseURL: 'https://' + firebaseProjectId + '.firebaseio.com',
  },
};