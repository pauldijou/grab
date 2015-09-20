// Test everything involving a body in the request
import seek from '../src/browser.js';

seek.defaults.base = 'http://localhost:3000';

describe('body >', ()=> {
  it('should post raw data', (done)=> {
    seek('/body', { method: 'POST', body: 'azerty' }).then((response)=> {
      expect(response.body).toEqual('azerty');
      done();
    });
  });

  it('should post JSON data', (done)=> {
    seek('/body', { method: 'POST', body: {test: 1} }).then((response)=> {
      expect(response.json()).toEqual({test: 1});
      done();
    });
  });
});
