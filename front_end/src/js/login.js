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

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        // ログイン成功
        location.href = '../screen.html';
      })
      .catch(error => {
        // ログイン失敗
        $('#error-message').text(error.message);
      });
  });
});