// Test basic usage (mostly get)
import grab from '../src/browser.js';

grab.defaults.base = 'http://localhost:3000';

function testOK(response) {
  expect(response.ok).toBe(true);
  expect(response.status).toBe(200);
  expect(response instanceof grab.Response).toBe(true);
  expect(response.body).toEqual('');
}

describe('GET', ()=> {
  it('should fetch data', (done)=> {
    grab('/status/200').then((response)=> {
      testOK(response);
      done();
    });
  });

  it('should fetch data bis', (done)=> {
    grab({ url: '/status/200' }).then((response)=> {
      testOK(response);
      done();
    });
  });

  it('should send headers', (done)=> {
    const headers = {
      'Authentication': 'Basic randomString',
      'X-TROLOLO': 'YOLO'
    };

    grab({ url: '/headers?Authentication&X-TROLOLO', headers }).then((response)=> {
      expect(response.body).toEqual(JSON.stringify(headers));
      done();
    });
  });
});
