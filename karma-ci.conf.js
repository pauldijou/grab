var customLaunchers = {
  'SL_InternetExplorer': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '10'
  }
};

module.exports = function(config) {
  config.set({
    sauceLabs: {
      testName: 'Grab Unit Tests'
    },
    customLaunchers: customLaunchers,
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'tests.webpack.js', watched: false },
    ],
    exclude: [],
    preprocessors: {
      'tests.webpack.js': ['webpack']
    },
    webpack: {
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
      },
      watch: false
    },
    webpackServer: {
      noInfo: true,
    },
    reporters: ['progress', 'saucelabs'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: Object.keys(customLaunchers),
    singleRun: true
  })
}
