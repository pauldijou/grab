// Constants and utils
const CONTENT_TYPE = 'Content-Type';

function noop() {}

function serializeQuery(params) {
  return Object.keys(params).reduce((query, param)=> {
    if (params.hasOwnProperty(param) && params[param] !== undef) {
      query.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
    }
    return query;
  }, []).join('&');
}

function hasQuery(url) {
  return (url.indexOf('?') > -1);
}

function fail(message) {
  throw new Error('Seek: ' + message);
}

function extractHeaders(xhr) {
  const tuples = xhr.getAllResponseHeaders().trim().split('\n');
  tuples.reduces((headers, tuple)=> {
    const keyValue = tuple.split(':');
    headers[keyValue.shift().trim()] = keyValue.join(':').trim();
    return headers;
  }, {});
}

// The real deal
export default function seekFactory(Promise, XMLHttpRequest, FormData, undef) {
  function parseFormData(body) {
    const form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        const split = bytes.split('=');
        const name = split.shift().replace(/\+/g, ' ');
        const value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    });
    return form;
  }

  class Response {
    constructor (xhr, status) {
      this.type = 'default';
      this.status = status;
      this.statusText = xhr.statusText;
      this.ok = this.status >= 200 && this.status < 300;
      this.headers = extractHeaders(xhr);
      this.body = 'response' in xhr ? xhr.response : xhr.responseText;
    },

    text () {
      return this.body;
    },

    json () {
      if (!this.bodyJSON) {
        this.bodyJSON = JSON.parse(this.text());
      }

      return this.bodyJSON;
    },

    formData () {
      if (!this.bodyFormData) {
        this.bodyFormData = parseFormData(this.text())
      }

      return this.bodyFormData;
    }
  }

  // The main logic of the lib: sending a XMLHttpRequest
  function send(options) {
    const request = new Promise((resolve, reject)=> {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        try {
          const status = (xhr.status === 1223) ? 204 : xhr.status;
          seek.defaults.log({ok: true, message: `Seek: ${options.method} ${options.url} => ${status}`});

          if (status < 100 || status > 599) {
            reject(new Error('Network request failed'));
          } else {
            resolve(new Response(xhr, status));
          }
        } catch (e) {
          reject(e); // IE could throw an error
        }
      };

      xhr.onerror = function () {
        seek.defaults.log({ok: false, message: `Seek: ${options.method} ${options.url} => XHR error`});
        reject(new Error('Network request failed'));
      };

      xhr.onabort = function () {
        seek.defaults.log({ok: false, message: `Seek: ${options.method} ${options.url} => XHR aborted`});
        reject(new Error('Request aborted (timeout or cancel)'));
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

      const cacheParam = options.cache === undef ? seek.defaults.cache : options.cache;

      if (cacheParam) {
        options.params[cacheParam === true ? '_' : cacheParam] = (new Date()).getTime();
      }

      const url = (options.base || seek.defaults.base)
        + options.url
        + (hasQuery(options.url) ? '&' : '?')
        + serializeQuery(params);

      // Open the XHR
      xhr.open(options.method, url, true);

      // Init headers
      if (options.responseType || seek.defaults.responseType) {
        xhr.responseType = options.responseType || seek.defaults.responseType;
      }

      if (options.headers === undef) {
        options.headers = {};
      }

      Object.keys(seek.defaults.headers).forEach(header=> {
        if (options.headers[header] === undef) {
          options.headers[header] = seek.defaults.headers[header];
        }
      });

      // Credentials
      if (options.credentials === false) {
        // Take priority over anything else => no credentials
      } else if (options.credentials || seek.defaults.credentials) {
        xhr.withCredentials = true;
      }

      // Body
      if (
        options.body !== null &&
        typeof options.body === 'object' &&
        !(options.body instanceof FormData)
      ) {
        if (!(CONTENT_TYPE in options.headers)) {
          options.headers[CONTENT_TYPE] = 'application/json';
          options.body = JSON.stringify(options.body);
        }
      }

      // Set headers
      Object.keys(options.headers).forEach(header=> {
        xhr.setRequestHeader(header, options.headers[header]);
      });

      // Send the request
      if (options.body !== undef && options.body !== null) {
        xhr.send(options.body);
      } else {
        xhr.send();
      }
    });

    // Timeout
    let timeout;
    const duration = options.timeout || seek.defaults.timeout;
    if (duration) {
      timeout = setTimeout(()=> {
        xhr.abort();
      }, duration);
    }

    function abort () {
      if (typeof timeout === 'number') {
        clearTimeout(timeout);
      }
      xhr.abort();
    }

    // User cancellation
    if (options.cancel && options.cancel.then) {
      options.cancel.then((value)=> {
        abort();
        return value;
      });
    }

    // Expose cancel method
    request.cancel = function cancel() {
      abort();
    };

    return request;
  }

  function seek(input, options = {}) {
    if (input === undef) fail('come on... there is no way do make a request without any arguments...');
    }

    if (typeof input === 'string') {
      if (typeof options !== 'object') fail('second argument "options" must be an object if the first one is a string.');
      options.url = input;
    } else if (typeof input === 'object') {
      options = input;
    } else {
      fail('Seek: first argument "input" must be a string or an object');
    }

    if (!options.url) fail('you need to provide an url, either with a string "input" or an "url" key inside the "options" object.');

    return send(options);
  }

  seek.defaults = {
    log: noop,
    timeout: 0,
    headers: {},
    cache: typeof window === 'undefined' ? false : !!(window.ActiveXObject || 'ActiveXObject' in window), // By default, only enabled on old IE (also the presence of ActiveXObject is a nice correlation with the cache bug)
    method: 'GET',
    base: '',
    credentials: false
  };

  seek.filterStatus = function filterStatus(status) {
    const typ = typeof status;
    let check;

    if (typ === 'function') {
      check = status;
    } else if (typ === 'number') {
      check = s => s === status;
    } else {
      fail(`status must be a number or a function but found ${typ}`);
    }

    return function (response) {
      return check(response.status) ? Promise.resolve(xhr) : Promise.reject(xhr);
    };
  };

  seek.filterSuccess = seek.filterStatus(s => s >= 200 && s < 300 || s === 304);

  seek.toJSON = function toJSON(response) {
    return new Promise((resolve, reject)=> {
      try {
        resolve(JSON.parse(response.body));
      } catch (e) {
        reject(e);
      }
    });
  }

  seek.getJSON = function getJSON(input, options) {
    return seek(input, options).then(seek.filterSuccess).then(seek.toJSON);
  }

  seek.serialize = serializeQuery;

  return seek;
};
