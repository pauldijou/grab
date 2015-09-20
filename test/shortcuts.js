// Test everything involving a body in the request
import seek from '../src/browser.js';

seek.defaults.base = 'http://localhost:3000';

function testOK(response) {
  expect(response.ok).toBe(true);
  expect(response.status).toBe(200);
  expect(response instanceof seek.Response).toBe(true);
  expect(response.body).toEqual('');
  expect(response.headers).toEqual({});
}

describe('shortcuts >', ()=> {
  it('should get', (done)=> {
    seek.get('/status/200').then(response=> {
      testOK(response);
      done();
    });
  });

  it('should delete', (done)=> {
    seek.delete('/status/200').then(response=> {
      testOK(response);
      done();
    });
  });

  it('should head', (done)=> {
    seek.head('/status/200').then(response=> {
      testOK(response);
      done();
    });
  });

  it('should post raw data', (done)=> {
    seek.post('/body', 'azerty').then((response)=> {
      expect(response.body).toEqual('azerty');
      done();
    });
  });

  it('should post json data', (done)=> {
    seek.post('/body', {test: 1}).then((response)=> {
      expect(response.json()).toEqual({test: 1});
      done();
    });
  });

  it('should put raw data', (done)=> {
    seek.put('/body', 'azerty').then((response)=> {
      expect(response.body).toEqual('azerty');
      done();
    });
  });

  it('should put json data', (done)=> {
    seek.put('/body', {test: 1}).then((response)=> {
      expect(response.json()).toEqual({test: 1});
      done();
    });
  });

  it('should patch raw data', (done)=> {
    seek.patch('/body', 'azerty').then((response)=> {
      expect(response.body).toEqual('azerty');
      done();
    });
  });

  it('should patch json data', (done)=> {
    seek.patch('/body', {test: 1}).then((response)=> {
      expect(response.json()).toEqual({test: 1});
      done();
    });
  });
});
