import api from "../services/api";
import { GET_RESULT_ORDER } from "../types";

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