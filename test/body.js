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

  fit('should send FormData', done=> {
    const body = new FormData();
    body.append('name', 'Paul');

    console.log(body);
    console.log(JSON.stringify(body));

    seek('/users', { method: 'POST', body, headers: { 'Content-Type': 'multipart/form-data' } }).then(response=> {
      console.log(response);
      console.log(response.body);
      done();
    }, error=> {
      console.log(error);
      done();
    })
  })
});
