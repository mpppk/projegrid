import React from 'react';
import firebase from 'firebase';
import qrcode from 'qrcode-npm';

import config from '../utils/config.js';

export class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {database: null};

    this.retrieveData = this.retrieveData.bind(this);
  }

  componentDidMount() {
    const firebaseConf = config.firebase.config;
    firebase.initializeApp(firebaseConf);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
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

  render() {
    let grid1, grid2, grid3, qrImg, url;
    grid1 = grid2 = grid3 = qrImg = url = null;
    let html = <div/>;

    // DBからデータ読み込み済み
    if (this.state.screenData) {
      const database = this.state.screenData;
      grid1 = database.grid1;
      grid2 = database.grid2;
      grid3 = database.grid3;
      const token = database.token;

      const qr = qrcode.qrcode(8, 'M');
      url = config.url + '/auth/check_in.html?token=' + token + '&screen=' + this.state.screen;
      qr.addData(url);
      qr.make();
      qrImg = qr.createImgTag(8);

      html = (
        <div>
          <div>Grid1: {grid1}</div>
          <div>Grid2: {grid2}</div>
          <div>Grid3: {grid3}</div>
          <div dangerouslySetInnerHTML={{__html:qrImg}}></div>
          <div>{url}</div>
        </div>
      );
    } else {
      html = <div>読み込み中...</div>;
    }

    return html;
  }
}
