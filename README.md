# grab

A promisified XMLHttpRequest with an API close to fetch.

## Install

```bash
npm install grab-http --save
```

**Requirements**

The Promise API. You can use [any](https://github.com/jakearchibald/es6-promise) [polyfill](https://github.com/petkaantonov/bluebird) [you](https://github.com/kriskowal/q) want, just be sure it's present inside the window / global object. Browser support is now [pretty good](http://caniuse.com/#search=promise) (except IE).

For very old browsers, consider including a [ES5 shim](https://github.com/es-shims/es5-shim) for methods like `Object.keys`.

**Dependencies**
- browser: none (only 400 LOC)
- node: [xmlhttprequest](https://www.npmjs.com/package/xmlhttprequest) and [form-data](https://www.npmjs.com/package/form-data)

**Features**
- support old browsers
- onProgress listener
- timeout
- cancel

## Usage

```javascript
import grab from 'grab-http';

// GET /api/users?limit=10
grab('/api/users', { params: { limit: 10 }}).then(response => {
  console.log(response.json());
}).catch(error => {
  console.error(error);
});

// POST /api/users
grab({method: 'POST', url: '/api/users', body: { name: 'Paul' }})
  .then(response => console.log('User created'))
  .catch(error => console.error(error));
```

## FAQ

- **What's the point? There is the fetch API now.** That's true, and if that's fine with you, use it. But right now, `fetch` has too many limitations for some projects, like no progress nor abort like XMLHttpRequest.

- **Is it the same API as fetch? Can I use it as a polyfill?** Not at all. It's quite close but not the same. For example, `cache` is just a boolean and not a string. All methods reading the response body are synchronous since there is no way to handle a XMLHttpRequest response asynchronously. Refer to the [API](#api) below for the full documentation.

## API

### grab(input, options)

#### Parameters

- **input**: either a string matching a valid url or an object used as the options parameter.
- **options**: object containing the request configuration
  - **url** (required if no  string input): a string containing the direct URL of the resource you want to grab.
  - **method** (default: 'GET'): the request method, e.g., GET, POST.
  - **body** (any): the body of the request. If JavaScript object, will be stringified and `Content-Type: application/json` header will be added
  - **params** (object): a map of key/value which will be added to the query string
  - **headers** (object): a map of key/value for all the request headers
  - **timeout** (number): the number of milliseconds before stopping the request, rejecting it with a TimeoutError.
  - **cancel** (Promise): when this promise is resolved, it will stop the request, rejecting it with a CancelError.
  - **credentials** (boolean): flag for `xhr.withCredentials`
  - **responseType** (string): assigned to `xhr.responseType`
  - **onProgress** (function): a function called by the XMLHttpRequest with a [progress event](https://developer.mozilla.org/en-US/docs/Web/Events/progress).
  - **urlEncoded** (boolean): if true, body objects will be serialized as form url encoded and `Content-Type: application/x-www-form-urlencoded` will be added.
  - **username** (string): optional user name to use for authentication purposes.
  - **password** (string): optional password to use for authentication purposes.

#### Returns

A promise that will eventually be resolved with a [Response](#response) object. This promise has a bonus method `cancel` that will abort the XMLHttpRequest if called. This method is not transitive, if you chain the promise, you will lose it.

### Response

#### Attributes

- **type**: contains the type of the response . Always 'default' right now
- **status**: contains the status code of the response (e.g., 200 for a success).
- **statusText**: contains the status message corresponding to the status code (e.g., OK for 200).
- **ok**: contains a boolean stating whether the response was successful (status in the range 200-299) or not.
- **headers**: contains all headers associated with the response as a map object of key/value.
- **body**: contains the raw body of the response.

#### Methods

- **text()**: return the raw body as string.
- **json()**: return the body as a JavaScript object (using JSON.parse).
- **formData()**: return the body as a FormData instance if possible.

### Defaults

You can override or add any default parameter using `grab.defaults`.

- **method** (string): `GET`
- **log** (function): empty. See [logging section](#logging).
- **timeout** (number): `0`
- **headers** (object): `{}`
- **cache** (boolean): `false` in most case except for some IE.
- **base** (string): `''`
- **credentials** (boolean): `false`

```javascript
// Set a timeout to all requests
grab.defaults.timeout = 60000;

// Add a custom header to all requests
grab.defaults.headers['X-Custom-Header'] = 'CustomValue';
```

Any parameter inside **options** when calling `grab` will override the defaults. For example, you can put a timeout for all your requests by default but disable it for a particular long request by setting `timeout: 0` inside the options. Objects will also be overridden and not merged. Feel free to add any other default you need, they will be copied inside the options if possible. For example, you can do `grab.defaults.urlEncoded = true;` to make all your requests form url encoded by default.

### Shortcuts

There is a shortcut for every HTTP methods, the syntax is `grab.[METHOD](url, [body], options)`. `POST`, `PUT` and `PATCH` supports a body parameter, all others don't.

```javascript
grab.get('/users');
grab.post('/users', { id: 1, name: 'Paul', admin: true });
grab.put('/users/1', { name: 'Alex', admin: false });
grab.patch('/users/1', { admin: true })
grab.delete('/users/1');
```

### Methods

#### grab.serialize

**Parameters**

A JavaScript object of key / value parameters.

**Returns**

A valid url query string.

```javascript
grab.serialize({page: 2, limit: 20});
// returns 'page=2&limit=20'
```

#### grab.resetDefaults

**Parameters**

None

**Returns**

Reset all defaults to their initial value and return it.

### Logging

You can enable logs by providing a `grab.defaults.log` function. It takes only one parameter which has the following attributes:

- **ok** (boolean): `true` if it's just an info, `false` if something went wrong.
- **message** (string): what just happened.

```javascript
grab.defaults.log = function (out) {
  if (out.ok) {
    console.log(out.message);
  } else {
    console.error(out.message);
  }
};
```

### Errors

Depending on your parameters or the network response, the following errors can be triggered.

- **TypeError**: probably something wrong with your parameters.
- **NetworkError**: the XMLHttpRequest has failed.
- **TimeoutError**: the request has reached its timeout.
- **CancelError**: you have manually canceled the request.
- **AbortError**: the XMLHttpRequest has been aborted but we don't really know why. Both `TimeoutError` and `CancelError` extend this error.

```javascript
import grab from 'grab-http';
import { TimeoutError, CancelError } from 'grab-http';

grab('/api/users', { timeout: 10 })
  .then(response=> {
    console.log('All users', response.json());
  })
  .catch(error=> {
    if (error instanceof TimeoutError) {
      console.warn('Couldn\'t make it in time...');
    } else if (error instanceof CancelError) {
      console.warn('Who canceled the request?!');
    } else {
      console.error(error);
    }
  });
```

You can also use error codes from `grab.errors`, you have `network`, `timeout`, `cancel` and `abort`.

```javascript
import grab from 'grab-http';

grab('/api/users', { timeout: 10 })
  .then(response=> {
    console.log('All users', response.json());
  })
  .catch(error=> {
    if (error.code === grab.errors.timeout) {
      console.warn('Couldn\'t make it in time...');
    } else if (error.code === grab.errors.cancel) {
      console.warn('Who canceled the request?!');
    } else {
      console.error(error);
    }
  });
```

## Tests

First start the dev server using `npm start` and then run the tests with `npm test`.

## Thanks

Thanks a lot to [@gre](https://github.com/gre) for all the inspiration from [qajax](https://github.com/gre/qajax).

## License

This software is licensed under the Apache 2 license, quoted below.

Copyright 2015 Paul Dijou ([http://pauldijou.fr](http://pauldijou.fr)).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
