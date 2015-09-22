(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["grab"] = factory();
	else
		root["grab"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _grab = __webpack_require__(1);

	var _grab2 = _interopRequireDefault(_grab);

	exports['default'] = (0, _grab2['default'])(window.XMLHttpRequest, window.FormData);
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	// Constants and utils
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	exports['default'] = grabFactory;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CONTENT_TYPE = 'Content-Type';
	var errors = {
	  network: 'NETWORK',
	  abort: 'ABORT',
	  cancel: 'CANCEL',
	  timeout: 'TIMEOUT'
	};

	function noop() {}

	function copy(value) {
	  if (value !== null && typeof value === 'object') {
	    var result = {};
	    for (var key in value) {
	      result[key] = copy(value[key]);
	    }
	    return result;
	  } else {
	    return value;
	  }
	}

	function hasQuery(url) {
	  return url.indexOf('?') > -1;
	}

	function fail(message) {
	  throw new TypeError('grab: ' + message);
	}

	function extractHeaders(xhr) {
	  var tuples = xhr.getAllResponseHeaders().trim().split('\n');
	  return tuples.reduce(function (headers, tuple) {
	    var keyValue = tuple.split(':');
	    if (keyValue[0]) {
	      headers[keyValue.shift().trim()] = keyValue.join(':').trim();
	    }
	    return headers;
	  }, {});
	}

	// Errors

	var NetworkError = (function (_Error) {
	  _inherits(NetworkError, _Error);

	  function NetworkError() {
	    _classCallCheck(this, NetworkError);

	    _get(Object.getPrototypeOf(NetworkError.prototype), 'constructor', this).call(this);
	    this.name = 'NetworkError';
	    this.code = errors.network;
	    this.message = 'Network request failed';
	  }

	  return NetworkError;
	})(Error);

	var AbortError = (function (_Error2) {
	  _inherits(AbortError, _Error2);

	  function AbortError() {
	    _classCallCheck(this, AbortError);

	    _get(Object.getPrototypeOf(AbortError.prototype), 'constructor', this).call(this);
	    this.name = 'AbortError';
	    this.code = errors.abort;
	    this.message = 'Request was aborted for an unknow reason';
	  }

	  return AbortError;
	})(Error);

	var CancelError = (function (_AbortError) {
	  _inherits(CancelError, _AbortError);

	  function CancelError() {
	    _classCallCheck(this, CancelError);

	    _get(Object.getPrototypeOf(CancelError.prototype), 'constructor', this).call(this);
	    this.name = 'CancelError';
	    this.code = errors.cancel;
	    this.message = 'Request canceled by user';
	  }

	  return CancelError;
	})(AbortError);

	var TimeoutError = (function (_AbortError2) {
	  _inherits(TimeoutError, _AbortError2);

	  function TimeoutError(duration) {
	    _classCallCheck(this, TimeoutError);

	    _get(Object.getPrototypeOf(TimeoutError.prototype), 'constructor', this).call(this);
	    this.name = 'CancelError';
	    this.code = errors.timeout;
	    this.message = 'Request timeout after ' + duration + 'ms';
	  }

	  return TimeoutError;
	})(AbortError);

	function parseFormData(body, FormData) {
	  if (!FormData) {
	    fail('FormData is not supported');
	  }

	  var form = new FormData();
	  body.trim().split('&').forEach(function (params) {
	    if (params) {
	      var keyValue = params.split('=');
	      var key = keyValue.shift().replace(/\+/g, ' ');
	      var value = keyValue.join('=').replace(/\+/g, ' ');
	      form.append(decodeURIComponent(key), decodeURIComponent(value));
	    }
	  });
	  return form;
	}

	var Response = (function () {
	  function Response(xhr, status, FormData) {
	    _classCallCheck(this, Response);

	    this.type = 'default';
	    this.status = status;
	    this.statusText = xhr.statusText;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.headers = extractHeaders(xhr);
	    this.body = 'response' in xhr ? xhr.response : xhr.responseText;
	    this.FormData = FormData;
	  }

	  // The real deal

	  _createClass(Response, [{
	    key: 'text',
	    value: function text() {
	      return this.body;
	    }
	  }, {
	    key: 'json',
	    value: function json() {
	      if (!this.bodyJSON) {
	        this.bodyJSON = JSON.parse(this.text());
	      }

	      return this.bodyJSON;
	    }
	  }, {
	    key: 'formData',
	    value: function formData() {
	      if (!this.bodyFormData) {
	        this.bodyFormData = parseFormData(this.text(), this.FormData);
	      }

	      return this.bodyFormData;
	    }
	  }]);

	  return Response;
	})();

	function grabFactory(XMLHttpRequest, FormData, undef) {
	  var defaults = {};

	  function resetDefaults() {
	    defaults.log = noop;
	    defaults.timeout = 0;
	    defaults.headers = {};
	    defaults.cache = typeof window === 'undefined' ? false : !!(window.ActiveXObject || 'ActiveXObject' in window); // By default; only enabled on old IE (also the presence of ActiveXObject is a nice correlation with the cache bug)
	    defaults.method = 'GET';
	    defaults.base = '';
	    defaults.credentials = false;
	  }

	  function assignDefaults(options) {
	    Object.keys(defaults).forEach(function (key) {
	      if (options[key] === undef) {
	        options[key] = copy(defaults[key]);
	      }
	    });
	  }

	  function serializeQuery(params) {
	    return Object.keys(params).reduce(function (query, param) {
	      if (params.hasOwnProperty(param) && params[param] !== undef) {
	        query.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
	      }
	      return query;
	    }, []).join('&');
	  }

	  // The main logic of the lib: sending a XMLHttpRequest
	  function send(options) {
	    assignDefaults(options);
	    var xhr = new XMLHttpRequest();

	    var request = new Promise(function (resolve, reject) {
	      xhr.onload = function () {
	        try {
	          var _status = xhr.status === 1223 ? 204 : xhr.status;
	          grab.defaults.log({ ok: true, message: 'grab: ' + options.method + ' ' + options.url + ' => ' + _status });

	          if (_status < 100 || _status > 599) {
	            reject(new NetworkError());
	          } else {
	            resolve(new Response(xhr, _status, FormData));
	          }
	        } catch (e) {
	          reject(e); // IE could throw an error
	        }
	      };

	      xhr.onerror = function () {
	        grab.defaults.log({ ok: false, message: 'grab: ' + options.method + ' ' + options.url + ' => XHR error' });
	        reject(new NetworkError());
	      };

	      xhr.onabort = function () {
	        grab.defaults.log({ ok: false, message: 'grab: ' + options.method + ' ' + options.url + ' => XHR ' + (canceled && 'canceled' || timedout && 'timeout' || 'aborted') });
	        if (canceled) {
	          reject(new CancelError());
	        } else if (timedout) {
	          reject(new TimeoutError(options.timeout));
	        } else {
	          reject(new AbortError());
	        }
	      };

	      if (options.onProgress) {
	        xhr.onprogress = function (progress) {
	          options.onProgress(progress);
	        };
	      }

	      // Append query params before opening
	      if (options.params === undef) {
	        options.params = {};
	      }

	      var cacheParam = options.cache === undef ? grab.defaults.cache : options.cache;

	      if (cacheParam) {
	        options.params[cacheParam === true ? '_' : cacheParam] = new Date().getTime();
	      }

	      var serializedParams = serializeQuery(options.params);

	      var url = (options.base || '') + options.url + (serializedParams ? (hasQuery(options.url) ? '&' : '?') + serializedParams : '');

	      // Open the XHR
	      xhr.open(options.method, url, true, options.username, options.password);

	      if (options.responseType) {
	        xhr.responseType = options.responseType;
	      }

	      // Init headers
	      if (options.headers === undef) {
	        options.headers = {};
	      }

	      // Credentials
	      if (options.credentials === false) {
	        // Take priority over anything else => no credentials
	      } else if (options.credentials) {
	          xhr.withCredentials = true;
	        }

	      // Body
	      if (options.body !== null && typeof options.body === 'object' && (!FormData || !(options.body instanceof FormData))) {
	        if (options.urlEncoded) {
	          if (!(CONTENT_TYPE in options.headers)) {
	            options.headers[CONTENT_TYPE] = 'application/x-www-form-urlencoded';
	          }
	          options.body = serializeQuery(options.body);
	        } else {
	          if (!(CONTENT_TYPE in options.headers)) {
	            options.headers[CONTENT_TYPE] = 'application/json';
	          }
	          options.body = JSON.stringify(options.body);
	        }
	      }

	      // Set headers
	      Object.keys(options.headers).forEach(function (header) {
	        xhr.setRequestHeader(header, options.headers[header]);
	      });

	      // Send the request
	      if (options.body !== undef && options.body !== null) {
	        xhr.send(options.body);
	      } else {
	        xhr.send();
	      }
	    });

	    // Timeout and abort
	    var canceled = false;
	    var timedout = false;
	    var timeout = undefined;
	    if (options.timeout) {
	      timeout = setTimeout(function () {
	        timedout = true;
	        xhr.abort();
	      }, options.timeout);
	    }

	    function cancelRequest() {
	      canceled = true;
	      if (typeof timeout === 'number') {
	        clearTimeout(timeout);
	      }
	      xhr.abort();
	    }

	    // User cancellation
	    if (options.cancel && options.cancel.then) {
	      options.cancel.then(function (value) {
	        cancelRequest();
	        return value;
	      });
	    }

	    // Expose cancel method
	    request.cancel = function cancel() {
	      cancelRequest();
	    };

	    return request;
	  }

	  function grab(input) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    if (input === undef) {
	      fail('come on... there is no way do make a request without any arguments...');
	    }

	    if (typeof input === 'string') {
	      if (typeof options !== 'object') fail('second argument "options" must be an object if the first one is a string.');
	      options.url = input;
	    } else if (typeof input === 'object') {
	      options = input;
	    } else {
	      fail('grab: first argument "input" must be a string or an object but got ' + typeof input);
	    }

	    if (!options.url) {
	      fail('you need to provide an url, either with a string "input" or an "url" key inside the "options" object.');
	    }

	    if (options.onProgress && typeof options.onProgress !== 'function') {
	      fail('onProgress must be a function');
	    }

	    if (options.timeout !== undef && (typeof options.timeout !== 'number' || options.timeout < 0)) {
	      fail('timeout must be a positive number');
	    }

	    if (options.cancel !== undef && typeof options.cancel.then !== 'function') {
	      fail('cancel must be a Promise with, at least, a "then" method');
	    }

	    return send(options);
	  }

	  // Shortcuts
	  function assignShortcut(method, url, body, options) {
	    if (!options) {
	      options = {};
	    }

	    options.url = url;
	    options.method = method;

	    if (body !== undef) {
	      options.body = body;
	    }

	    return options;
	  }

	  grab.get = function get(url, options) {
	    options = assignShortcut('GET', url, undef, options);
	    return grab(options);
	  };

	  // Not a typo, 'delete' is a reserved word
	  grab['delete'] = function delet(url, options) {
	    options = assignShortcut('DELETE', url, undef, options);
	    return grab(options);
	  };

	  grab.options = function options(url, options) {
	    options = assignShortcut('OPTIONS', url, undef, options);
	    return grab(options);
	  };

	  grab.head = function head(url, options) {
	    options = assignShortcut('HEAD', url, undef, options);
	    return grab(options);
	  };

	  grab.trace = function trace(url, options) {
	    options = assignShortcut('TRACE', url, undef, options);
	    return grab(options);
	  };

	  grab.connect = function connect(url, options) {
	    options = assignShortcut('CONNECT', url, undef, options);
	    return grab(options);
	  };

	  grab.post = function post(url, body, options) {
	    options = assignShortcut('POST', url, body, options);
	    return grab(options);
	  };

	  grab.put = function put(url, body, options) {
	    options = assignShortcut('PUT', url, body, options);
	    return grab(options);
	  };

	  grab.patch = function patch(url, body, options) {
	    options = assignShortcut('PATCH', url, body, options);
	    return grab(options);
	  };

	  // Util methods
	  grab.serialize = serializeQuery;

	  // Types
	  grab.Response = Response;

	  grab.NetworkError = NetworkError;
	  grab.AbortError = AbortError;
	  grab.TimeoutError = TimeoutError;
	  grab.CancelError = CancelError;

	  grab.errors = errors;

	  // Expose defaults
	  grab.defaults = defaults;

	  grab.resetDefaults = resetDefaults;

	  resetDefaults();

	  return grab;
	}

	;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;