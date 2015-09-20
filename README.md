# seek

A promisified XMLHttpRequest with an API close to fetch.

## Install

```bash
npm install seek-js --save
```

**Requirements**

The Promise API. You can use any polyfill you want, just be sure it's present inside the window / global object. Browser support is now [pretty good](https://www.npmjs.com/package/) (except IE).

**Dependencies**
- browser: none (only 400 LOC)
- node: [xmlhttprequest](https://www.npmjs.com/package/xmlhttprequest) and [form-data](https://www.npmjs.com/package/form-data)

**Features**
- support old browsers (up to IE8)
- onProgress listener
- timeout
- cancel

## Usage

```javascript
import seek from 'seek-js';

// GET /api/users/1
seek('/api/users/1').then(response=> {
  console.log(response.json());
}).catch(error=> {
  console.error(error);
});

// POST /api/users
seek({method: 'POST', url: '/api/users', body: { name: 'Paul' }})
  .then(seek.filterSuccess) // Helper to separate OK HTTP status and the other ones
  .then(response => console.log('User created'))
  .catch(error => console.error(error));
```

## FAQ

- **What's the point? There is the fetch API now.** That's true, and if that's fine with you, use it. But right now, `fetch` has too many limitations for some projects, like no progress nor abort like XMLHttpRequest.

- **Is it the same API as fetch? Can I use it as a polyfill?** Not at all. It's quite close but not the same. For example, `cache` is just a boolean and not a string. All methods reading the response body are synchronous since there is no way to handle a XMLHttpRequest response asynchronously. Refer to the [API](#api) below for the full documentation.

## API

### seek(input, options)

#### Parameters

- **input**: either a string matching a valid url or an object used as the options parameter.
- **options**: object containing the request configuration
  - url (required if no  string input): a string containing the direct URL of the resource you want to seek.
  - method (default: 'GET'): the request method, e.g., GET, POST.
  - body (any): the body of the request. If JavaScript object, will be stringified and `Content-Type: application/json` header will be added
  - headers (object): a map of key/value for all the request headers
  - timeout (number): the number of milliseconds before stopping the request, rejecting it with a TimeoutError.
  - cancel (Promise): when this promise is resolved, it will stop the request, rejecting it with a CancelError.
  - credentials (boolean): flag for `xhr.withCredentials`
  - responseType (string): assigned to `xhr.responseType`
  - onProgress (function): a function called by the XMLHttpRequest with a [progress event](https://developer.mozilla.org/en-US/docs/Web/Events/progress).

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

You can override or add any default parameter using `seek.defaults`.

- **method** (string): `GET`
- **log** (function): empty. See [logging section](#logging).
- **timeout** (number): `0`
- **headers** (object): `{}`
- **cache** (boolean): `false` in most case except for some IE.
- **base** (string): `''`
- **credentials** (boolean): `false`

```javascript
// Set a timeout to all requests
seek.defaults.timeout = 60000;

// Add a custom header to all requests
seek.defaults.headers['X-Custom-Header'] = 'CustomValue';
```

Any parameter inside **options** when calling `seek` will override the defaults. For example, you can put a timeout for all your requests by default but disable it for a particular long request by setting `timeout: 0` inside the options.

### Shortcuts

There is a shortcut for every HTTP methods, the syntax is `seek.[METHOD](url, [body], options)`.

```javascript
seek.get('/users');
seek.post('/users', { id: 1, name: 'Paul', admin: true });
seek.put('/users/1', { name: 'Alex', admin: false });
seek.patch('/users/1', { admin: true })
seek.delete('/users/1');
```

### Utils

#### seek.filterSuccess

Use it when chaining your promises to reject all non-ok responses.

```javascript
seek('/api/users')
  .then(seek.filterSuccess)
  .then(response=> {
    console.log(response.ok === true); // true
  }, response=> {
    console.log(response.ok === false); // true
  });
```

#### seek.filterStatus(status)

Reject all responses not matching a particular status (if number) or returning `false` to a predicate (if function).

```javascript
// Only keep 3xx status
const filter300 = seek.filterStatus(status=> status >= 300 && status < 400);
seek('/api/users').then(seek.filter300);

// Only keep 404 status
seek('/api/users').then(seek.filterStatus(404));
```

#### seek.toJSON

Extract the body of the response as JSON. Reject if parsing fail.

```javascript
seek('/api/users').then(seek.toJSON);
```

### seek.getJSON(input, options)

An alias to perform a request, then filter successful responses and finally parse the body as JSON.

```javascript
// Doing...
seek.getJSON('/api/users')

// is equivalent to
seek('/api/users').then(seek.filterSuccess).then(seek.toJSON);
```

### Logging

You can enable logs by providing a `seek.defaults.log` function. It takes only one parameter which has the following attributes:

- **ok** (boolean): `true` if it's just an info, `false` if something went wrong.
- **message** (string): what just happened.

```javascript
seek.defaults.log = function (out) {
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
import seek from 'seek-js';
import { TimeoutError, CancelError } from 'seek-js';

seek('/api/users', { timeout: 10 })
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

## Tests

First start the dev server using `npm start` and then run the tests with `npm test`.

## Thanks

Thanks a lot to [@gre](https://github.com/gre) for all the inspiration from [qajax](https://github.com/gre/qajax).

## License

This software is licensed under the Apache 2 license, quoted below.

Copyright 2015 Paul Dijou ([http://pauldijou.fr](http://pauldijou.fr)).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
