$(function(){
    var config = {
        apiKey: "AIzaSyDNBvfpc07ND30lVfjcPYE6VddcVd237mQ",
        authDomain: "sample-5f412.firebaseapp.com",
        databaseURL: "https://sample-5f412.firebaseio.com",
        storageBucket: "sample-5f412.appspot.com",
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $('#message').text('ログイン中：' + user.email);
        } else {
            $('#message').text('ログインしてない');                                        
        }
    }); 
});