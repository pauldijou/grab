// Test everything involving a body in the request
import grab from '../src/browser.js';

grab.defaults.base = 'http://localhost:3000';

describe('body >', ()=> {
  it('should post raw data', (done)=> {
    grab('/body', { method: 'POST', body: 'azerty' }).then((response)=> {
      expect(response.body).toEqual('azerty');
      done();
    });
  });

  it('should post JSON data', (done)=> {
    grab('/body', { method: 'POST', body: {test: 1} }).then((response)=> {
      expect(response.json()).toEqual({test: 1});
      done();
    });
  });

  it('should post form url encoded data', (done)=> {
    grab('/body', { method: 'POST', body: {test: '1', and: 'more'}, urlEncoded: true }).then((response)=> {
      expect(response.json()).toEqual({test: '1', and: 'more'});
      done();
    });
  });

  it('should send FormData as multipart/form-data', done=> {
    const body = new FormData();
    body.append('name', 'Paul');

    grab('/users', { method: 'POST', body }).then(response=> {
      const user = response.json();
      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      expect(user.name).toEqual('Paul');
      expect(typeof user.id).toEqual('number');
      done();
    });
  });
});
