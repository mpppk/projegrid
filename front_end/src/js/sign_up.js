import 'whatwg-fetch';
import $ from 'jquery';
import firebase from 'firebase';

import config from './utils/config.js';

$(() => {
  const firebaseConf = config.firebase;
  firebase.initializeApp(firebaseConf);

  $('#form').on('submit', (e) => {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();

    // ユーザーを登録する
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        // 登録成功
        location.href = config.url + '/screen.html';
      })
      .catch(err => {
        // ユーザー登録失敗
        $('#error-message').text(err.message);
      });
  });
});