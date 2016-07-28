import React from 'react';
import firebase from 'firebase';

export class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { database: null };

    this.retriveData = this.retriveData.bind(this);
  }

  componentDidMount() {
    const config = {
      apiKey: "AIzaSyDNBvfpc07ND30lVfjcPYE6VddcVd237mQ",
      authDomain: "sample-5f412.firebaseapp.com",
      databaseURL: "https://sample-5f412.firebaseio.com",
      storageBucket: "sample-5f412.appspot.com",
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        this.retriveData(user);
      } else {
        // ログインしていないのでトップページにリダイレクト
        location.href = '/';
      }
    }.bind(this));
  }

  retriveData(user) {
    const gridsData = firebase.database()
      .ref(`screens/${user.uid}`);
    gridsData.on('value', (data) => {
      const gridsData = JSON.stringify(data.val());
      if (gridsData !== null) {
        this.setState({
          database: gridsData,
        });
      }
    });
  }

  render() {
    let data = 'no data';
    console.log(this.state);
    if (this.state.database !== null) {
      data = this.state.database;
    }

    return (
      <div>
        {data}
      </div>
    );
  }
}
