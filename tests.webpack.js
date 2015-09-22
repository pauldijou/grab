require('es5-shim');
require('es6-promise').polyfill();
var tests = require.context('./test', true, /\.js$/);
tests.keys().forEach(tests);
