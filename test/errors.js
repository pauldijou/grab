// Test all possible errors
import grab from '../src/browser.js';

grab.defaults.base = 'http://localhost:3000';

function testNetwork(error) {
  expect(error.code).toEqual(grab.errors.network);
  expect(error instanceof grab.NetworkError).toBe(true);
}

function testTimeout(error) {
  expect(error.code).toEqual(grab.errors.timeout);
  expect(error instanceof grab.TimeoutError).toBe(true);
}

function testCancel(error) {
  expect(error.code).toEqual(grab.errors.cancel);
  expect(error instanceof grab.CancelError).toBe(true);
}

describe('errors >', ()=> {
  describe('invalid parameters >', ()=> {
    it('should require parameters', ()=> {
      expect(grab).toThrowError(TypeError);
    });

    it('should require url', ()=> {
      expect(grab.bind(null, {})).toThrowError(TypeError);
    });

    it('should only accept string or object as first arg', ()=> {
      expect(grab.bind(null, 1)).toThrowError(TypeError);
      expect(grab.bind(null, true)).toThrowError(TypeError);
      expect(grab.bind(null, null)).toThrowError(TypeError);
    });
  });

  describe('network error >', ()=> {
    it('should reject on status 1', (done)=> {
      grab('/status/1').catch((error)=> {
        testNetwork(error);
        done();
      });
    });

    it('should reject on status 4242', (done)=> {
      grab('/status/4242').catch((error)=> {
        testNetwork(error);
        done();
      });
    });
  });

  describe('timeout error >', ()=> {
    it('should timeout', (done)=> {
      grab('/pending', { timeout: 1 }).catch((error)=> {
        testTimeout(error);
        done();
      });
    });
  });

  describe('cancel error >', ()=> {
    it('should reject when canceled', (done)=> {
      const request = grab('/pending');

      request.catch((error)=> {
        testCancel(error);
        done();
      });

      request.cancel();
    });

    it('should auto cancel is cancel promise is already resolved', (done)=> {
      grab('/pending', { cancel: Promise.resolve() }).catch((error)=> {
        testCancel(error);
        done();
      });
    });

    it('should cancel when cancel promise is resolved', (done)=> {
      const cancel = new Promise((resolve)=> {
        setTimeout(()=> {
          resolve();
        }, 1);
      });

      grab('/pending', { cancel }).catch((error)=> {
        testCancel(error);
        done();
      });
    });
  });
});
