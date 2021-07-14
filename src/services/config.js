import { platform } from './platform';
let urldefault = '';
const headersdefault = {};

if(platform === 'localhost'){
    urldefault = "http://localhost/sampoerna";
    headersdefault['Content-Type'] = 'application/json';
    headersdefault['X-POS-KEY'] = 'ebc15ef93d40c9386b3713b0ce3e4349';
}else if(platform === 'dev'){
    urldefault = "http://10.60.64.76:9445/sampoerna";
    headersdefault['Content-Type'] = 'application/json';
    headersdefault['X-POS-KEY'] = 'ebc15ef93d40c9386b3713b0ce3e4349';
}else{
    urldefault = "https://order.posindonesia.co.id";
    headersdefault['Content-Type'] = 'application/json';
    headersdefault['X-POS-KEY'] = 'ebc15ef93d40c9386b3713b0ce3e4349';
}

export const url = urldefault;
export const headers = headersdefault;