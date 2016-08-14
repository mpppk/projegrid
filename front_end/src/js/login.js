import 'whatwg-fetch';
import $ from 'jquery';
import firebase from 'firebase';

import config from './utils/config.js';

$(() => {
  const firebaseConf = config.firebase;
  firebase.initializeApp(firebaseConf);
  const database = firebase.database();

  $('#form').on('submit', (e) => {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();

    // TODO 例外処理
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(error => {
        // ログイン失敗
        $('#error-message').text(error.message);
      })
      .then(user => {
        // ログイン成功
        location.href = config.url + '/screen.html';
      });
  });
});