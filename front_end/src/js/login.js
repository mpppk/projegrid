import 'whatwg-fetch';
import $ from 'jquery';
import firebase from 'firebase';

import config from './utils/config.js';

$(() => {
  const firebaseConf = config.firebase.config;
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
        // APIでトークンを生成し取得する
        const tokenRequest = fetch(config.url + '/api/user/token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
        });

        // トークンをFirebaseのDBに登録するための参照
        const screen = database.ref(`screens/${user.uid}`);

        return Promise.all([tokenRequest, screen]);
      })
      .then(p => {
        const response = p[0];
        const database = p[1];
        return Promise.all([response.json(), database]);
      })
      .then(p => {
        const data = p[0];
        const database = p[1];
        
        // DBのtokenキーに書き込む
        database.update({
          token: data.token,
        });
        location.href = config.url + '/screen.html';
      });
  });
});