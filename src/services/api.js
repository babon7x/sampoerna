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
        }).then(res => res.data),
        post: (params) => axios.post(`${url}/user`, {...params}, config).then(res => res.data),
        registrasi: (payload) => axios.post(`${url}/registrasi`, { ...payload }, config).then(res => res.data),
        cekemail: (params) => axios.get(`${url}/user/cekemail`, { 
            params, 
            headers, 
            onDownloadProgress: config.onDownloadProgress 
        }).then(res => res.data)
    },
    referensi: {
        getOffice: (params) => axios.get(`${url}/referensi/getoffice`, { params, headers }).then(res => res.data),
        getMenu: (params) => axios.get(`${url}/referensi/menu`, { params, headers }).then(res => res.data)
    },
    purchase: {
        post: (payload) => axios.post(`${url}/purchase`, { ...payload }, config).then(res => res.data),
        get: (params) => axios.get(`${url}/purchase`,{ 
            params: {
                ...params,
                limit: params.type === 'data' ? params.limit : undefined,
                offset: params.type === 'data' ? params.offset : undefined,
            }, 
            headers, 
            onDownloadProgress: params.type === 'data' ? config.onDownloadProgress : () => {}
        }).then(res => res.data)
    },
    order: {
        getAddress: (params) => axios.get(`${url}/referensi/address`, { 
            params,
            headers
        }).then(res => res.data)
    }
}