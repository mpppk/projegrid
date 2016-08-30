import React from 'react';
import firebase from 'firebase';

import config from '../utils/config.js';

import {baseUrl} from '../utils/url.js';
import Grids from './grid/grids.jsx';
import QrCode from './common/qrcode.jsx';

export class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenId: '',
      screenData: '',
    };

    this.retrieveData = this.retrieveData.bind(this);
  }

  componentDidMount() {
    const firebaseConf = config.firebase;
    firebase.initializeApp(firebaseConf);
    firebase.auth().onAuthStateChanged(function (user) {
      // スクリーンユーザーかどうか判定
      if (!user || user.isAnonymous) {
        // ログインしていないか匿名ユーザーなのでトップページにリダイレクト
        location.href = '/';
      } else {
        // 正規のスクリーンユーザーだった

        // スクリーンのトークンを設定する
        fetch(baseUrl() + `/api/token`, {method: 'GET'})
          .then(res => res.json())
          .then(json => {
            const screenRef = firebase.database().ref(`screens/${user.uid}`);
            screenRef.update({
              token: json.token,
            });
            this.retrieveData(user, screenRef);
          })
          .catch(err => console.log);
      }
    }.bind(this));
  }

  /**
   * DBからgridのデータを取得しstateに格納する
   * @param user 現在ログインしているFirebaseのUserオブジェクト
   */
  retrieveData(user, screenRef) {
    // データ更新時に自動でReactのstateに格納するように設定
    screenRef.on('value', (data) => {
      const screenData = data.val();
      if (screenData !== null) {
        this.setState({
          screenData: Object.assign({}, screenData),
        });
      }
    });

    this.setState({
      screenId: user.uid,
    });
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

      return (
        <div>
          <Grids grid1={grid1} grid2={grid2} grid3={grid3} screenId={this.state.screenId} screenToken={token}/>
        </div>
      );
    } else {
      // チェックインしていない

      const {token} = this.state.screenData;

      return (
        <div>
          <QrCode screenId={this.state.screenId} screenToken={token}/>
        </div>
      );
    }
  }
}
