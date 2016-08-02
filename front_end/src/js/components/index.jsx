import React from 'react';
import firebase from 'firebase';

import config from '../utils/config.js';

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentWillMount() {
    const firebaseConf = config.firebase.config;
    firebase.initializeApp(firebaseConf);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: user,
        });
      } else {
        this.setState({
          user: null,
        });
      }
    });
  }

  handleLogout(e) {
    e.preventDefault();

    firebase.auth().signOut()
      .then(() => {
        location.href = config.url;
      })
      .catch(() => {
        location.href = config.url;
      });
  }

  render() {
    if (this.state.user !== null && !this.state.user.isAnonymous) {
      return (
        <div>
          <div>ログイン中： {this.state.user.email}</div>
          <div><a href="screen.html">スクリーン</a></div>
          <div><a href="" onClick={this.handleLogout}>ログアウト</a></div>
        </div>
      );
    } else if (this.state.user !== null && this.state.user.isAnonymous) {
      // 匿名でログイン中
      return (
        <div>
          <div>アノニマスログイン中</div>
          <div>スクリーン表示不可</div>
          <div><a href="" onClick={this.handleLogout}>ログアウト</a></div>
        </div>
      );
    } else {
      return (
        <div>
          <div>ログインしてない</div>
          <div><a href="auth/login.html">スクリーンログイン</a></div>
        </div>
      );

    }
  }
}
