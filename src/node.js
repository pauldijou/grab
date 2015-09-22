import grabFactory from './grab';
import { XMLHttpRequest } from 'xmlhttprequest';
import FormData from 'form-data';

export default grabFactory(XMLHttpRequest, FormData);
