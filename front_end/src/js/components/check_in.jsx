import 'whatwg-fetch';
import 'babel-polyfill';
import React from 'react';
import firebase from 'firebase';
import queryString from 'query-string';

import config from '../utils/config.js';
import {baseUrl} from '../utils/url.js';

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

    // URLのクエリパラメータを取得
    const parsed = queryString.parse(location.search);
    const screenId = parsed.screen_id;
    const screenToken = parsed.screen_token;

    if (!screenId || !screenToken) {
      // チェックイン失敗
      console.error('invalid query parameter');
      this.setState({
        initialized: true,
      });
      return;
    }

    this.setState({
      param: {
        screenId: screenId,
        screenToken: screenToken,
      },
    });

    let user;
    // 既にログイン済みの場合そのユーザーを利用する
    // ログインしていない場合、新しく匿名ユーザーとしてログインする
    firebase.auth().onAuthStateChanged(u => {
      if (u) {
        user = u
      } else {
        firebase.auth().signInAnonymously()
          .then(u => user = u)
          .catch(error => console.error)
      }

      // ログインに失敗している
      if (!user) {
        return;
      }

      this.setState({user: user});

      start.bind(this)(user, screenId, screenToken);
    });

    async function start(user, screenId, screenToken) {
      // ユーザーDBの参照
      const database = firebase.database();

      // ログインに成功したので次はチェックインを試みる
      fetch(baseUrl() + '/api/screen/check_in', {
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
            database: database,
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
    fetch(baseUrl() + '/api/screen/check_out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        screenId: this.state.param.screenId,
        secretToken: this.state.secretToken,
      }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json()
            .then(json => Promise.reject(new Error(json)));
        }
      })
      .catch(console.log)
      .then(() => {
        return this.state.user.delete();
      })
      .catch(console.log)
      .then(() => {
        location.href = '../';
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
