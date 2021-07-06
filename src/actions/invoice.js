import api from "../services/api";
import { COUNT_INVOICE, GET_INVOICE } from "../types";

export const getData = (payload, activePage) => dispatch =>
    api.invoice.report(payload)
        .then(res => {
            if(res.rscode === 200){
                dispatch({
                    type: payload.type === 'data' ? GET_INVOICE : COUNT_INVOICE,
                    result: res.result,
                    page: payload.type === 'data' ? `page_${activePage}` : undefined
                })
            }else{
                Promise.reject(res);
            }
        })