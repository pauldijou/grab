var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'node': './src/node',
    'browser': './src/browser'
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },

  resolve: {
    extensions: ['.js']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }]
  }
};
