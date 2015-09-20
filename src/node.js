import seekFactory from './seek';
import { XMLHttpRequest } from 'xmlhttprequest';
import FormData from 'form-data';

export default seekFactory(XMLHttpRequest, FormData);
