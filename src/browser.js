import seekFactory from './seek';

export { NetworkError, AbortError, TimeoutError, CancelError, Response } from './seek';
export default seekFactory(window.XMLHttpRequest, window.FormData);
