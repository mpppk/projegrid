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

  componentDidMount() {
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

  render() {
    if (this.state.user !== null) {
      return (
        <div>
          <div>ログイン中： {this.state.user.email}</div>
          <div><a href="screen.html">スクリーン</a></div>
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
