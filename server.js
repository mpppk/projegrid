const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index.js');

const app = express();
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());

app.use('/', index);

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});

