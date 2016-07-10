const path = require('path');

const express = require('express');
const mustacheExpress = require('mustache-express');

const index = require('./routes/index.js');

const app = express();
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(express.static(__dirname + '/static'));

app.use('/', index);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

