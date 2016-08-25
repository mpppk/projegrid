import 'whatwg-fetch';
import 'babel-polyfill';
import React from 'react';
import firebase from 'firebase';
import queryString from 'query-string';

import config from '../utils/config.js';

export class CheckIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      checkedIn: false,
      database: null,
      param: null,
      secretToken: '',
      user: null,
    };
    this.handleSubmitGrid1 = this.handleSubmitGrid1.bind(this);
    this.handleSubmitGrid2 = this.handleSubmitGrid2.bind(this);
    this.handleSubmitGrid3 = this.handleSubmitGrid3.bind(this);
    this.handleCheckOut = this.handleCheckOut.bind(this);
  }

  componentWillMount() {
    // Firebaseのセットアップ
    const firebaseConf = config.firebase;
    firebase.initializeApp(firebaseConf);
    const database = firebase.database();

    // URLのクエリパラメータを取得
    const parsed = queryString.parse(location.search);
    const screenId = parsed.screen_id;
    const screenToken = parsed.screen_token;

    this.setState({
      database: database,
      param: {
        screenId: screenId,
        screenToken: screenToken,
      },
    });

    start.bind(this)(database, screenId, screenToken);

    async function start(database, screenId, screenToken) {
      if (!screenId || !screenToken) {
        // チェックイン失敗
        console.error('invalid query parameter');
        return;
      }

      // アノニマスログインし、そのアカウントにtokenとscreenTokenを設定する。
      let user;
      try {
        user = await firebase.auth().signInAnonymously();
      } catch (error) {
        // ログイン失敗
        console.error(error);
        return;
      }
      this.setState({user: user});

      // ユーザーDBの参照
      const userRef = database.ref(`users/${user.uid}`);


      // ログインに成功したので次はチェックインを試みる
      fetch(config.url + '/api/screen/check_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screenId: screenId,
          screenToken: screenToken,
          userUid: user.uid,
        }),
      })
        .then(response => {
          if (response.ok) {
            // チェックイン成功
            return response.json();
          } else {
            // チェックイン失敗
            return response.json()
              .then(json => Promise.reject(new Error(json)))
              .catch(error => Promise.reject(error));
          }
        })
        .then(json => {
          this.setState({
            secretToken: json.secretToken,
            checkedIn: true,
            initialized: true,
          });
        })
        .catch(error => {
          console.error(error);
          this.setState({
            initialized: true,
          });
        });
    }
  }

  handleSubmitGrid1(e) {
    e.preventDefault();
    if (this.grid1Input !== null) {
      const inputVal = this.grid1Input.value;
      const screenRef = this.state.database.ref(`/screens/${this.state.param.screenId}`);
      screenRef.update({
        grid1: inputVal,
      });
    }
  }

  handleSubmitGrid2(e) {
    e.preventDefault();
    if (this.grid2Input !== null) {
      const inputVal = this.grid2Input.value;
      const screenRef = this.state.database.ref(`/screens/${this.state.param.screenId}`);
      screenRef.update({
        grid2: inputVal,
      });
    }
  }

  handleSubmitGrid3(e) {
    e.preventDefault();
    if (this.grid3Input !== null) {
      const inputVal = this.grid3Input.value;
      const screenRef = this.state.database.ref(`/screens/${this.state.param.screenId}`);
      screenRef.update({
        grid3: inputVal,
      });
    }
  }

  /**
   * チェックアウト時の処理
   * @param e
   */
  handleCheckOut(e) {
    e.preventDefault();
    fetch(config.url + '/api/screen/check_out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        screen: this.state.param.screenId,
        screenToken: this.state.secretToken,
      }),
    })
      .then(response => {
        if (response.ok) {
          return this.state.user.delete();
        } else {
          return response.json()
            .then(json => Promise.reject(new Error(json)));
        }
      })
      .then(() => {
        location.href = config.url;
      })
      .catch(error => {
        console.error(error);
        location.href = config.url;
      });
  }


  render() {
    if (this.state.initialized === false) {
      return (<div>読み込み中...</div>);
    }
    if (this.state.checkedIn === false) {
      return (<div>チェックイン失敗</div>);
    } else {
      return (<div>
          <div>チェックイン中： {this.state.user.uid}</div>
          <div>
            <form onSubmit={this.handleSubmitGrid1}>
              <label>grid1<input ref={ref => this.grid1Input = ref} type="text"/></label>
              <input id="grid1_submit" type="submit"/>
            </form>
          </div>
          <div>
            <form onSubmit={this.handleSubmitGrid2}>
              <label>grid2<input ref={ref => this.grid2Input = ref} type="text"/></label>
              <input id="grid2_submit" type="submit"/>
            </form>
          </div>
          <div>
            <form onSubmit={this.handleSubmitGrid3}>
              <label>grid3<input ref={ref => this.grid3Input = ref} type="text"/></label>
              <input id="grid3_submit" type="submit"/>
            </form>
          </div>
          <div>
            <a href="" onClick={this.handleCheckOut}>チェックアウト</a>
          </div>
        </div>
      );
    }
  }
}
