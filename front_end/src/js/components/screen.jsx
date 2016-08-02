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
    let html = <div/>;

    if (!this.state.screenData) {
      // DBからデータ読み込み中

      html = <div>読み込み中...</div>;

    } else {
      // DBからデータ読み込み済み

      const {grid1, grid2, grid3, token, state} = this.state.screenData;

      if (state === 'checked_in') {
        html = (
          <div>
            <div>Grid1: {grid1}</div>
            <div>Grid2: {grid2}</div>
            <div>Grid3: {grid3}</div>
          </div>
        );
      } else {
        const qr = qrcode.qrcode(9, 'M');
        const url = config.url + '/auth/check_in.html?screen_token=' + token + '&screen=' + this.state.screen;
        qr.addData(url);
        qr.make();
        const qrImg = qr.createImgTag(9);

        html = (
          <div>
            <div dangerouslySetInnerHTML={{__html: qrImg}}></div>
            <div>{url}</div>
          </div>
        );
      }
    }

    return html;
  }
}
