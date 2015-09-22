// Test everything involving a body in the request
import grab from '../src/browser.js';

grab.defaults.base = 'http://localhost:3000';

function testOK(response) {
  expect(response.ok).toBe(true);
  expect(response.status).toBe(200);
  expect(response instanceof grab.Response).toBe(true);
  expect(response.body).toEqual('');
  expect(response.headers).toEqual({});
}

describe('shortcuts >', ()=> {
  it('should get', (done)=> {
    grab.get('/status/200').then(response=> {
      testOK(response);
      done();
    });
  });

  it('should delete', (done)=> {
    grab.delete('/status/200').then(response=> {
      testOK(response);
      done();
    });
  });

  it('should head', (done)=> {
    grab.head('/status/200').then(response=> {
      testOK(response);
      done();
    });
  });

  it('should post raw data', (done)=> {
    grab.post('/body', 'azerty').then((response)=> {
      expect(response.body).toEqual('azerty');
      done();
    });
  });

  it('should post json data', (done)=> {
    grab.post('/body', {test: 1}).then((response)=> {
      expect(response.json()).toEqual({test: 1});
      done();
    });
  });

  it('should put raw data', (done)=> {
    grab.put('/body', 'azerty').then((response)=> {
      expect(response.body).toEqual('azerty');
      done();
    });
  });

  it('should put json data', (done)=> {
    grab.put('/body', {test: 1}).then((response)=> {
      expect(response.json()).toEqual({test: 1});
      done();
    });
  });

  it('should patch raw data', (done)=> {
    grab.patch('/body', 'azerty').then((response)=> {
      expect(response.body).toEqual('azerty');
      done();
    });
  });

  it('should patch json data', (done)=> {
    grab.patch('/body', {test: 1}).then((response)=> {
      expect(response.json()).toEqual({test: 1});
      done();
    });
  });
});
