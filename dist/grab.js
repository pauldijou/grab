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

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _grab = __webpack_require__(1);

	var _grab2 = _interopRequireDefault(_grab);

	exports['default'] = _grab2['default'](window, window.XMLHttpRequest, window.FormData);
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	// Constants and utils
	'use strict';

	exports.__esModule = true;
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

	    _Error.call(this);
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

	    _Error2.call(this);
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

	    _AbortError.call(this);
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

	    _AbortError2.call(this);
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

	  Response.prototype.text = function text() {
	    return this.body;
	  };

	  Response.prototype.json = function json() {
	    if (!this.bodyJSON) {
	      this.bodyJSON = JSON.parse(this.text());
	    }

	    return this.bodyJSON;
	  };

	  Response.prototype.formData = function formData() {
	    if (!this.bodyFormData) {
	      this.bodyFormData = parseFormData(this.text(), this.FormData);
	    }

	    return this.bodyFormData;
	  };

	  return Response;
	})();

	function grabFactory(global, XMLHttpRequest, FormData, undef) {
	  var defaults = {};

	  function resetDefaults() {
	    defaults.log = noop;
	    defaults.timeout = 0;
	    defaults.headers = {};
	    defaults.cache = typeof window === 'undefined' ? false : !!(window.ActiveXObject || 'ActiveXObject' in window); // By default; only enabled on old IE (also the presence of ActiveXObject is a nice correlation with the cache bug)
	    defaults.method = 'GET';
	    defaults.base = '';
	    defaults.credentials = false;
	    defaults.FormData = FormData;
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

	  function initXHR() {
	    if (XMLHttpRequest) {
	      return new XMLHttpRequest();
	    }

	    try {
	      return new global.ActiveXObject('Msxml2.XMLHTTP.6.0');
	    } catch (e) {}
	    try {
	      return new global.ActiveXObject('Msxml2.XMLHTTP.3.0');
	    } catch (e) {}
	    try {
	      return new global.ActiveXObject('Microsoft.XMLHTTP');
	    } catch (e) {}

	    throw new Error('I have no idea which browser you are using... but there is no such thing as XMLHttpRequest in it.');
	  }

	  // The main logic of the lib: sending a XMLHttpRequest
	  function send(options) {
	    assignDefaults(options);
	    var xhr = initXHR();

	    var request = new Promise(function (resolve, reject) {
	      xhr.onreadystatechange = function () {
	        if (xhr.readyState !== 4) {
	          return;
	        }

	        try {
	          var _status = xhr.status === 1223 ? 204 : xhr.status;

	          if (!_status) {
	            if (canceled) {
	              grab.defaults.log({ ok: false, message: 'grab: ' + options.method + ' ' + options.url + ' => XHR canceled' });
	              reject(new CancelError());
	            } else if (timedout) {
	              grab.defaults.log({ ok: false, message: 'grab: ' + options.method + ' ' + options.url + ' => XHR timed out after ' + options.timeout + 'ms' });
	              reject(new TimeoutError(options.timeout));
	            } else {
	              grab.defaults.log({ ok: false, message: 'grab: ' + options.method + ' ' + options.url + ' => XHR error' });
	              reject(new NetworkError());
	            }
	          } else {
	            if (_status < 100 || _status > 599) {
	              grab.defaults.log({ ok: false, message: 'grab: ' + options.method + ' ' + options.url + ' => ' + _status });
	              reject(new NetworkError());
	            } else {
	              grab.defaults.log({ ok: true, message: 'grab: ' + options.method + ' ' + options.url + ' => error ' + _status });
	              resolve(new Response(xhr, _status, options.FormData));
	            }
	          }
	        } catch (e) {
	          reject(e); // IE could throw an error
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
	      if (options.body !== null && typeof options.body === 'object' && (!options.FormData || !(options.body instanceof options.FormData))) {
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

	  grab.resetDefaults = resetDefaults;

	  // Types
	  grab.Response = Response;

	  grab.NetworkError = NetworkError;
	  grab.AbortError = AbortError;
	  grab.TimeoutError = TimeoutError;
	  grab.CancelError = CancelError;

	  grab.errors = errors;

	  // Expose defaults
	  grab.defaults = defaults;

	  resetDefaults();

	  return grab;
	}

	;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;