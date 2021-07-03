import api from "../services/api";
import { COUNT_ORDER, GET_ORDER, RESET_ORDER } from "../types";

export const getOrder = (payload, activePage) => dispatch =>
    api.order.get(payload)
        .then(response => {
            if(response.rscode === 200){
                dispatch({
                    type: payload.type === 'data' ? GET_ORDER : COUNT_ORDER,
                    data: response.data,
                    page: payload.type === 'data' ? `page_${activePage}` : undefined
                })
            }else{
                dispatch({
                    type: RESET_ORDER
                })
                
                return Promise.reject(response);
            }
        })