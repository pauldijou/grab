// Test basic usage (mostly get)
import seek from '../src/browser.js';

seek.defaults.base = 'http://localhost:3000';

function testOK(response) {
  expect(response.ok).toBe(true);
  expect(response.status).toBe(200);
  expect(response instanceof seek.Response).toBe(true);
  expect(response.body).toEqual('');
  expect(response.headers).toEqual({});
}

describe('GET', ()=> {
  it('should fetch data', (done)=> {
    seek('/status/200').then((response)=> {
      testOK(response);
      done();
    });
  });

  it('should fetch data bis', (done)=> {
    seek({ url: '/status/200' }).then((response)=> {
      testOK(response);
      done();
    });
  });

  it('should send headers', (done)=> {
    const headers = {
      'Authentication': 'Basic randomString',
      'X-TROLOLO': 'YOLO'
    };

    seek({ url: '/headers?Authentication&X-TROLOLO', headers }).then((response)=> {
      expect(response.body).toEqual(JSON.stringify(headers));
      done();
    });
  })
});
