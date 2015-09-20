(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["seek"] = factory();
	else
		root["seek"] = factory();
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

	var _seek = __webpack_require__(1);

	var _seek2 = _interopRequireDefault(_seek);

	exports['default'] = (0, _seek2['default'])(window.XMLHttpRequest, window.FormData);
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

	exports['default'] = seekFactory;

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

	function serializeQuery(params) {
	  return Object.keys(params).reduce(function (query, param) {
	    if (params.hasOwnProperty(param) && params[param] !== undef) {
	      query.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
	    }
	    return query;
	  }, []).join('&');
	}

	function hasQuery(url) {
	  return url.indexOf('?') > -1;
	}

	function fail(message) {
	  throw new TypeError('Seek: ' + message);
	}

	function extractHeaders(xhr) {
	  var tuples = xhr.getAllResponseHeaders().trim().split('\n');
	  tuples.reduce(function (headers, tuple) {
	    var keyValue = tuple.split(':');
	    headers[keyValue.shift().trim()] = keyValue.join(':').trim();
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
	    this.code = errors.timeout;
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

	function seekFactory(XMLHttpRequest, FormData, undef) {
	  var defaults = {
	    log: noop,
	    timeout: 0,
	    headers: {},
	    cache: typeof window === 'undefined' ? false : !!(window.ActiveXObject || 'ActiveXObject' in window), // By default, only enabled on old IE (also the presence of ActiveXObject is a nice correlation with the cache bug)
	    method: 'GET',
	    base: '',
	    credentials: false
	  };

	  function assignDefaults(options) {
	    Object.keys(defaults).forEach(function (key) {
	      if (options[key] === undef) {
	        options[key] = defaults[key];
	      }
	    });
	  }

	  // The main logic of the lib: sending a XMLHttpRequest
	  function send(options) {
	    assignDefaults(options);

	    var request = new Promise(function (resolve, reject) {
	      var xhr = new XMLHttpRequest();

	      xhr.onload = function () {
	        try {
	          var _status = xhr.status === 1223 ? 204 : xhr.status;
	          seek.defaults.log({ ok: true, message: 'Seek: ' + options.method + ' ' + options.url + ' => ' + _status });

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
	        seek.defaults.log({ ok: false, message: 'Seek: ' + options.method + ' ' + options.url + ' => XHR error' });
	        reject(new NetworkError());
	      };

	      xhr.onabort = function () {
	        seek.defaults.log({ ok: false, message: 'Seek: ' + options.method + ' ' + options.url + ' => XHR ' + (canceled && 'canceled' || timedout && 'timeout' || 'aborted') });
	        if (canceled) {
	          reject(new CancelError());
	        } else if (timedout) {
	          reject(new TimeoutError(options.timeout));
	        } else {
	          reject(new AbortError());
	        }
	      };

	      if (options.notify || options.onProgress) {
	        xhr.onprogress = function (progress) {
	          (options.notify || options.onProgress)(progress);
	        };
	      }

	      // Append query params before opening
	      if (options.params === undef) {
	        options.params = {};
	      }

	      var cacheParam = options.cache === undef ? seek.defaults.cache : options.cache;

	      if (cacheParam) {
	        options.params[cacheParam === true ? '_' : cacheParam] = new Date().getTime();
	      }

	      var serializedParams = serializeQuery(options.params);

	      var url = (options.base || '') + options.url + (serializedParams ? (hasQuery(options.url) ? '&' : '?') + serializedParams : '');

	      // Open the XHR
	      xhr.open(options.method, url, true);

	      // Init headers
	      if (options.responseType) {
	        xhr.responseType = options.responseType;
	      }

	      if (options.headers === undef) {
	        options.headers = {};
	      }

	      Object.keys(seek.defaults.headers).forEach(function (header) {
	        if (options.headers[header] === undef) {
	          options.headers[header] = seek.defaults.headers[header];
	        }
	      });

	      // Credentials
	      if (options.credentials === false) {
	        // Take priority over anything else => no credentials
	      } else if (options.credentials) {
	          xhr.withCredentials = true;
	        }

	      // Body
	      if (options.body !== null && typeof options.body === 'object' && (!FormData || !(options.body instanceof FormData))) {
	        if (!(CONTENT_TYPE in options.headers)) {
	          options.headers[CONTENT_TYPE] = 'application/json';
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

	  function seek(input) {
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
	      fail('Seek: first argument "input" must be a string or an object');
	    }

	    if (!options.url) {
	      fail('you need to provide an url, either with a string "input" or an "url" key inside the "options" object.');
	    }

	    return send(options);
	  }

	  seek.defaults = defaults;

	  seek.erros = errors;

	  seek.filterSuccess = function (response) {
	    return response.ok ? Promise.resolve(response) : Promise.reject(response);
	  };

	  seek.filterStatus = function filterStatus(status) {
	    var typ = typeof status;
	    var check = undefined;

	    if (typ === 'function') {
	      check = status;
	    } else if (typ === 'number') {
	      check = function (s) {
	        return s === status;
	      };
	    } else {
	      fail('status must be a number or a function but found ' + typ);
	    }

	    return function (response) {
	      return check(response.status) ? Promise.resolve(response) : Promise.reject(response);
	    };
	  };

	  seek.toJSON = function toJSON(response) {
	    return response.json();
	  };

	  seek.getJSON = function getJSON(input, options) {
	    return seek(input, options).then(seek.filterSuccess).then(seek.toJSON);
	  };

	  seek.serialize = serializeQuery;

	  seek.Response = Response;

	  seek.NetworkError = NetworkError;
	  seek.AbortError = AbortError;
	  seek.TimeoutError = TimeoutError;
	  seek.CancelError = CancelError;

	  seek.errors = errors;

	  return seek;
	}

	;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;