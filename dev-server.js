var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

config.entry = Object.assign({}, config.entry, {
  dev_server: 'webpack-dev-server/client?http://localhost:3000',
  only_dev_server: 'webpack/hot/only-dev-server',
  }
);

config.plugins.push(new webpack.HotModuleReplacementPlugin());

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  contentBase: './static/',
  historyApiFallback: true,
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000/');
});
