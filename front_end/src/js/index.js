import $ from 'jquery';
import firebase from 'firebase';

import config from './utils/config.js';

$(function () {
  const firebaseConf = config.firebase.config;
  firebase.initializeApp(firebaseConf);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $('#message').text('ログイン中：' + user.email);
    } else {
      $('#message').text('ログインしてない');
    }
  });
});