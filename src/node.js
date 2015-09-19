import seekFactory from './seek';
import { XMLHttpRequest } from 'xmlhttprequest';
import FormData from 'form-data';

export { NetworkError, AbortError, TimeoutError, CancelError, Response } from './seek';
export default seekFactory(XMLHttpRequest, FormData);
