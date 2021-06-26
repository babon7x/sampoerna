import axios from "axios";
import { headers, url } from './config';
import { store } from '../App';
import { SET_LOADING_PROGERES } from "../types";

let config = {
    headers,
    onDownloadProgress: progressEvent => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        store.dispatch({
            type: SET_LOADING_PROGERES,
            percentage: percentCompleted
        });
    }
}

//eslint-disable-next-line
export default {
    auth: (payload) => axios.post(`${url}/auth`, {
         ...payload
    }, config).then(res => res.data),
    user: {
        get: (params) => axios.get(`${url}/user`, { 
            params, 
            headers, 
            onDownloadProgress: params.type === 'data' ? config.onDownloadProgress : () => {}
        }).then(res => res.data)
    }
}