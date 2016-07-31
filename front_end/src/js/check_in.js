import $ from 'jquery';
import firebase from 'firebase';
import queryString from 'query-string';

import config from './utils/config.js';

// Firebaseのセットアップ
const firebaseConf = config.firebase.config;
firebase.initializeApp(firebaseConf);
const database = firebase.database();

// URLのクエリパラメータを取得
const parsed = queryString.parse(location.search);
const screen = parsed.screen;
const token = parsed.token;

if (!screen || !token) {
  // チェックイン失敗
  location.href = config.url;
}

firebase.auth().signInAnonymously()
  .then(user => {
    const d = database.ref(`users/${user.uid}`);
    d.update({
      screen: screen,
      screenToken: token,
    });
  })
  .catch(error => {
    console.error(error);
  });

$(() => {
  const screenRef = database.ref(`/screens/${screen}`);

  $('#grid1_submit').on('click', () => {
    const newGridVal = $('#grid1').val();
    screenRef.update({
      grid1: newGridVal,
    });
  });
  $('#grid2_submit').on('click', () => {
    const newGridVal = $('#grid2').val();
    screenRef.update({
      grid2: newGridVal,
    });
  });
  $('#grid3_submit').on('click', () => {
    const newGridVal = $('#grid3').val();
    screenRef.update({
      grid3: newGridVal,
    });
  });
});