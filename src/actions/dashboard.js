import api from "../services/api";
import { GET_PO_USED, GET_RESULT_ORDER } from "../types";

export const getResultOrder = (payload) => dispatch =>
    api.dashboard.resultorder(payload)
        .then(response => {
            if(response.rscode === 200){
                dispatch({
                    type: GET_RESULT_ORDER,
                    result: response.data
                })
            }else{
                return Promise.reject(response);
            }
        })

export const getPoUsed = (payload) => dispatch =>
    api.dashboard.poused(payload)
        .then(response => {
            if(response.rscode === 200){
                dispatch({
                    type: GET_PO_USED,
                    result: response.data
                })
            }else{
                return Promise.reject(response);
            }
        })