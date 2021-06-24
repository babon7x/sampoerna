import api from "../services/api";
import { SET_LOGGED_IN } from "../types";

export const login = (payload) => dispatch =>
    api.auth(payload)
        .then(response => {
            if(response.rscode === 200){
                dispatch({
                    type: SET_LOGGED_IN,
                    user: response.user
                })
            }else{
                return Promise.reject(response);
            }
        })