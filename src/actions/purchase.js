import api from "../services/api";
import { COUNT_PURCHASE, GET_PURCHASE } from "../types";

export const getPurchase = (params, activePage) => dispatch =>
    api.purchase.get(params)
        .then(response => {
            if(response.rscode === 200){
                dispatch({
                    type: params.type === 'data' ? GET_PURCHASE : COUNT_PURCHASE,
                    page: params.type === 'data' ? `page_${activePage}` : undefined,
                    list: response.data
                })
            }else{
                return Promise.reject(response);
            }
        })