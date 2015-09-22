require('es6-promise').polyfill();
var tests = require.context('./test', true, /\.js$/);
tests.keys().forEach(tests);
