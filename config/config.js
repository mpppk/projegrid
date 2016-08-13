const firebaseProjectId = 'sample-5f412';
module.exports = {
  url: '',
  firebase: {
    config: {
      apiKey: 'AIzaSyDNBvfpc07ND30lVfjcPYE6VddcVd237mQ',
      authDomain: firebaseProjectId + '.firebaseapp.com',
      databaseURL: 'https://' + firebaseProjectId + '.firebaseio.com',
      // authDomain: `${firebaseProjectId}.firebaseapp.com`,
      // databaseURL: `https://${firebaseProjectId}.firebaseio.com`,
    },
    serviceAccount: {
      projectId: firebaseProjectId || process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
      clientEmail: '' || process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      privateKey: '' || process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
    },
  },
};
