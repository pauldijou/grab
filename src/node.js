import grabFactory from './grab';
import { XMLHttpRequest } from 'xmlhttprequest';

export default grabFactory(global, XMLHttpRequest);
