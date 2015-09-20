var tests = require.context('./test', true, /\.js$/);
tests.keys().forEach(tests);
