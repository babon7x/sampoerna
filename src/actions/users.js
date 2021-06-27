import api from "../services/api";
import { ADD_USER, COUNT_USERS, GET_USERS } from "../types";

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

export const addData = (payload) => dispatch => 
    api.user.post(payload)
        .then(res => {
            if(res.rscode === 200){
                dispatch({
                    type: ADD_USER,
                    data: res.transref,
                    page: 'page_1'
                })

                return Promise.resolve(res);
            }else{
                return Promise.reject(res);
            }
        })