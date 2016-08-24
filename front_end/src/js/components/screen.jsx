import React from 'react';
import firebase from 'firebase';
import qrcode from 'qrcode-npm';

import config from '../utils/config.js';

export class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: '',
      screenData: '',
    };

    this.retrieveData = this.retrieveData.bind(this);
  }

  componentDidMount() {
    const firebaseConf = config.firebase;
    firebase.initializeApp(firebaseConf);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user && !user.isAnonymous) {
        this.setState({
          screen: user.uid,
        });
        this.retrieveData(user);
      } else {
        // ログインしていないのでトップページにリダイレクト
        location.href = '/';
      }
    }.bind(this));
  }

  /**
   * DBからgridのデータを取得しstateに格納する
   * @param user 現在ログインしているFirebaseのUserオブジェクト
   */
  retrieveData(user) {
    const gridsData = firebase.database()
      .ref(`screens/${user.uid}`);
    gridsData.on('value', (data) => {
      const screenData = data.val();
      if (screenData !== null) {
        this.setState({
          screenData: Object.assign({}, screenData),
        });
      }
    });
  }

  /**
   * 取得した文字列のQRコードを生成する
   * 文字列が長すぎると例外が発生するので適宜バージョンを変更する
   * @param string
   * @return string QRコードの画像の<img>タグ
   */
  genQrCode(string) {
    // バージョン9 誤り訂正レベルMのQRコード
    const qr = qrcode.qrcode(9, 'M');
    qr.addData(string);
    qr.make();
    return qr.createImgTag(9);
  }

  render() {
    if (!this.state.screenData) {
      // DBからデータ読み込み中

      return (<div>読み込み中...</div>);
    }
    // DBからデータ読み込み済み

    const {state} = this.state.screenData;

    if (state === 'checked_in') {
      // チェックイン済み

      const {grid1, grid2, grid3, token} = this.state.screenData;

      // QRコード生成
      const url = config.url + '/auth/check_in.html?screen_token=' + token + '&screen=' + this.state.screen;
      const qrImg = this.genQrCode(url);

      return (
        <div>
          <div>Grid1: {grid1}</div>
          <div>Grid2: {grid2}</div>
          <div>Grid3: {grid3}</div>
          <div dangerouslySetInnerHTML={{__html: qrImg}}></div>
          <div>{url}</div>
        </div>
      );
    } else {
      // チェックインしていない

      const {token} = this.state.screenData;

      // QRコード生成
      const url = config.url + '/auth/check_in.html?screen_token=' + token + '&screen=' + this.state.screen;
      const qrImg = this.genQrCode(url);

      return (
        <div>
          <div dangerouslySetInnerHTML={{__html: qrImg}}></div>
          <div>{url}</div>
        </div>
      );
    }

  }
}
