import 'whatwg-fetch';
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
    };
    this.handleSubmitGrid1 = this.handleSubmitGrid1.bind(this);
    this.handleSubmitGrid2 = this.handleSubmitGrid2.bind(this);
    this.handleSubmitGrid3 = this.handleSubmitGrid3.bind(this);
    this.handleCheckOut = this.handleCheckOut.bind(this);
  }

  componentWillMount() {
    // Firebaseのセットアップ
    const firebaseConf = config.firebase.config;
    firebase.initializeApp(firebaseConf);
    const database = firebase.database();

    // URLのクエリパラメータを取得
    const parsed = queryString.parse(location.search);
    const screen = parsed.screen;
    const screenToken = parsed.screen_token;

    this.setState({
      database: database,
      param: {
        screen: screen,
        screenToken: screenToken,
      },
    });

    this.start(database, screen, screenToken);
  }

  start(database, screen, screenToken) {
    if (!screen || !screenToken) {
      // チェックイン失敗
      console.error('invalid query parameter');
      return;
    }

    // アノニマスログインし、そのアカウントにtokenとscreenTokenを設定する。
    firebase.auth().signInAnonymously()
      .then(user => {
        const userRef = database.ref(`users/${user.uid}`);
        userRef.update({
          screen: screen,
          screenToken: screenToken,
        });
      })
      .catch(error => {
        // ログイン失敗
        console.error(error);
        return Promise.reject(new Error());
      })
      // ログインに成功したので次はチェックインを試みる
      .then(() => {
        return fetch(config.url + '/api/screen/check_in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            screen: screen,
            screenToken: screenToken,
          }),
        });
      })
      .then(response => {
        if (response.ok) {
          // チェックイン成功
          return Promise.resolve();
        } else {
          // チェックイン失敗
          return response.json()
            .then(json => Promise.reject(json))
            .catch(error => Promise.reject(error));
        }
      })
      // チェックイン成功
      .then(() => {
        this.setState({
          checkedIn: true,
          initialized: true,
        });
      })
      // チェックイン失敗
      .catch(error => {
        console.error(error);
        this.setState({
          initialized: true,
        });
      });
  }

  handleSubmitGrid1(e) {
    e.preventDefault();
    if (this.grid1Input !== null) {
      const inputVal = this.grid1Input.value;
      const screenRef = this.state.database.ref(`/screens/${this.state.param.screen}`);
      screenRef.update({
        grid1: inputVal,
      });
    }
  }

  handleSubmitGrid2(e) {
    e.preventDefault();
    if (this.grid2Input !== null) {
      const inputVal = this.grid2Input.value;
      const screenRef = this.state.database.ref(`/screens/${this.state.param.screen}`);
      screenRef.update({
        grid2: inputVal,
      });
    }
  }

  handleSubmitGrid3(e) {
    e.preventDefault();
    if (this.grid3Input !== null) {
      const inputVal = this.grid3Input.value;
      const screenRef = this.state.database.ref(`/screens/${this.state.param.screen}`);
      screenRef.update({
        grid3: inputVal,
      });
    }
  }

  handleCheckOut(e) {
    e.preventDefault();
    fetch(config.url + '/api/screen/check_out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        screen: this.state.param.screen,
        screenToken: this.state.param.screenToken,
      }),
    })
      .then(response => {
        if (response.ok) {
          location.href = config.url;
        } else {
          return Promise.reject(new Error(response.status));
        }
      })
      .catch(error => {
        console.error(error);
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
