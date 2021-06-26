import api from "../services/api";
import { COUNT_USERS, GET_USERS } from "../types";

export const getData = (payload, activePage) => dispatch =>
    api.user.get(payload)
        .then(res => {
            if(res.rscode === 200){
                const { data } = res;
                dispatch({
                    type: payload.type === 'count' ? COUNT_USERS : GET_USERS,
                    data,
                    page: `page_${activePage}`
                })
            }else{
                return Promise.reject(res);
            }
        })