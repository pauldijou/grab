// Test all possible errors
import seek from '../src/browser.js';

seek.defaults.base = 'http://localhost:3000';

function testNetwork(error) {
  expect(error.code).toEqual(seek.errors.network);
  expect(error instanceof seek.NetworkError).toBe(true);
}

function testTimeout(error) {
  expect(error.code).toEqual(seek.errors.timeout);
  expect(error instanceof seek.TimeoutError).toBe(true);
}

function testCancel(error) {
  expect(error.code).toEqual(seek.errors.cancel);
  expect(error instanceof seek.CancelError).toBe(true);
}

describe('errors >', ()=> {
  describe('invalid parameters >', ()=> {
    it('should require parameters', ()=> {
      expect(seek).toThrowError(TypeError);
    });

    it('should require url', ()=> {
      expect(seek.bind(null, {})).toThrowError(TypeError);
    });

    it('should only accept string or object as first arg', ()=> {
      expect(seek.bind(null, 1)).toThrowError(TypeError);
      expect(seek.bind(null, true)).toThrowError(TypeError);
      expect(seek.bind(null, null)).toThrowError(TypeError);
    });
  });

  describe('network error >', ()=> {
    it('should reject on status 1', (done)=> {
      seek('/status/1').catch((error)=> {
        testNetwork(error);
        done();
      });
    });

    it('should reject on status 4242', (done)=> {
      seek('/status/4242').catch((error)=> {
        testNetwork(error);
        done();
      });
    });
  });

  describe('timeout error >', ()=> {
    it('should timeout', (done)=> {
      seek('/pending', { timeout: 1 }).catch((error)=> {
        testTimeout(error);
        done();
      });
    });
  });

  describe('cancel error >', ()=> {
    it('should reject when canceled', (done)=> {
      const request = seek('/pending');

      request.catch((error)=> {
        testCancel(error);
        done();
      });

      request.cancel();
    });

    it('should auto cancel is cancel promise is already resolved', (done)=> {
      seek('/pending', { cancel: Promise.resolve() }).catch((error)=> {
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

      seek('/pending', { cancel }).catch((error)=> {
        testCancel(error);
        done();
      });
    });
  });
});
