// Constants and utils
const CONTENT_TYPE = 'Content-Type';
const errors = {
  network: 'NETWORK',
  abort: 'ABORT',
  cancel: 'CANCEL',
  timeout: 'TIMEOUT'
};

function noop() {}

function copy(value) {
  if (value !== null && typeof value === 'object') {
    const result = {};
    for (let key in value) {
      result[key] = copy(value[key]);
    }
    return result;
  } else {
    return value;
  }
}

function hasQuery(url) {
  return (url.indexOf('?') > -1);
}

function fail(message) {
  throw new TypeError('grab: ' + message);
}

function extractHeaders(xhr) {
  const tuples = xhr.getAllResponseHeaders().trim().split('\n');
  return tuples.reduce((headers, tuple)=> {
    const keyValue = tuple.split(':');
    if (keyValue[0]) {
      headers[keyValue.shift().trim()] = keyValue.join(':').trim();
    }
    return headers;
  }, {});
}

// Errors
class NetworkError extends Error {
  constructor () {
    super();
    this.name = 'NetworkError';
    this.code = errors.network;
    this.message = 'Network request failed';
  }
}

class AbortError extends Error {
  constructor () {
    super();
    this.name = 'AbortError';
    this.code = errors.abort;
    this.message = 'Request was aborted for an unknow reason';
  }
}

class CancelError extends AbortError {
  constructor () {
    super();
    this.name = 'CancelError';
    this.code = errors.cancel;
    this.message = 'Request canceled by user';
  }
}

class TimeoutError extends AbortError {
  constructor (duration) {
    super();
    this.name = 'CancelError';
    this.code = errors.timeout;
    this.message = `Request timeout after ${duration}ms`;
  }
}

function parseFormData(body, FormData) {
  if (!FormData) {
    fail('FormData is not supported');
  }

  const form = new FormData();
  body.trim().split('&').forEach(function (params) {
    if (params) {
      const keyValue = params.split('=');
      const key = keyValue.shift().replace(/\+/g, ' ');
      const value = keyValue.join('=').replace(/\+/g, ' ');
      form.append(decodeURIComponent(key), decodeURIComponent(value))
    }
  });
  return form;
}

class Response {
  constructor (xhr, status, FormData) {
    this.type = 'default';
    this.status = status;
    this.statusText = xhr.statusText;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = extractHeaders(xhr);
    this.body = 'response' in xhr ? xhr.response : xhr.responseText;
    this.FormData = FormData;
  }

  text () {
    return this.body;
  }

  json () {
    if (!this.bodyJSON) {
      this.bodyJSON = JSON.parse(this.text());
    }

    return this.bodyJSON;
  }

  formData () {
    if (!this.bodyFormData) {
      this.bodyFormData = parseFormData(this.text(), this.FormData)
    }

    return this.bodyFormData;
  }
}

// The real deal
export default function grabFactory(global, XMLHttpRequest, FormData, undef) {
  const defaults = {};

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
    Object.keys(defaults).forEach(key=> {
      if (options[key] === undef && key !== 'FormData') {
        options[key] = copy(defaults[key]);
      }
    });

    // We need to treat FormData differently since we
    // don't want to clone the object but keep the constructor as it is
    if (options.FormData === undef) {
      options.FormData = defaults.FormData;
    }
  }

  function serializeQuery(params) {
    return Object.keys(params).reduce((query, param)=> {
      if (params.hasOwnProperty(param) && params[param] !== undef) {
        query.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
      }
      return query;
    }, []).join('&');
  }

  function initXHR () {
    if (XMLHttpRequest) {
      return new XMLHttpRequest();
    }

    try { return new global.ActiveXObject('Msxml2.XMLHTTP.6.0'); }
    catch (e) {}
    try { return new global.ActiveXObject('Msxml2.XMLHTTP.3.0'); }
    catch (e) {}
    try { return new global.ActiveXObject('Microsoft.XMLHTTP'); }
    catch (e) {}

    throw new Error('I have no idea which browser you are using... but there is no such thing as XMLHttpRequest in it.');
  }

  // The main logic of the lib: sending a XMLHttpRequest
  function send(options) {
    assignDefaults(options);
    const xhr = initXHR();

    const request = new Promise((resolve, reject)=> {
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) { return; }

        try {
          const status = (xhr.status === 1223) ? 204 : xhr.status;

          if (!status) {
            if (canceled) {
              grab.defaults.log({ok: false, message: `grab: ${options.method} ${options.url} => XHR canceled`});
              reject(new CancelError());
            } else if (timedout) {
              grab.defaults.log({ok: false, message: `grab: ${options.method} ${options.url} => XHR timed out after ${options.timeout}ms`});
              reject(new TimeoutError(options.timeout));
            } else {
              grab.defaults.log({ok: false, message: `grab: ${options.method} ${options.url} => XHR error`});
              reject(new NetworkError());
            }
          } else {
            if (status < 100 || status > 599) {
              grab.defaults.log({ok: false, message: `grab: ${options.method} ${options.url} => ${status}`});
              reject(new NetworkError());
            } else {
              grab.defaults.log({ok: true, message: `grab: ${options.method} ${options.url} => error ${status}`});
              resolve(new Response(xhr, status, options.FormData));
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

      const cacheParam = options.cache === undef ? grab.defaults.cache : options.cache;

      if (cacheParam) {
        options.params[cacheParam === true ? '_' : cacheParam] = (new Date()).getTime();
      }

      const serializedParams = serializeQuery(options.params);

      const url = (options.base || '')
        + options.url
        + (serializedParams ?
          (hasQuery(options.url) ? '&' : '?') + serializedParams :
          '');

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
      if (
        options.body !== null &&
        typeof options.body === 'object' &&
        (!options.FormData || !(options.body instanceof options.FormData))
      ) {
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
      Object.keys(options.headers).forEach(header => {
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
    let canceled = false;
    let timedout = false;
    let timeout;
    if (options.timeout) {
      timeout = setTimeout(()=> {
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
      options.cancel.then((value)=> {
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

  function grab(input, options = {}) {
    if (input === undef) {
      fail('come on... there is no way do make a request without any arguments...');
    }

    if (typeof input === 'string') {
      if (typeof options !== 'object') fail('second argument "options" must be an object if the first one is a string.');
      options.url = input;
    } else if (typeof input === 'object') {
      options = input;
    } else {
      fail('grab: first argument "input" must be a string or an object but got ' + (typeof input));
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

  // Not a typo either, Safari didn't like having a parameter named 'options'
  // as it shadows the name of a strict mode function.
  grab.options = function options(url, opts) {
    opts = assignShortcut('OPTIONS', url, undef, opts);
    return grab(opts);
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
};
