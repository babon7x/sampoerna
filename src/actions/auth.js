import api from "../services/api";
import { GET_MENU, RESET_MENU, SET_LOGGED_IN, SET_LOGGED_OUT } from "../types";
import defaultmenu from '../json/defaultmenu.json';

export const login = (payload) => dispatch =>
    api.auth(payload)
        .then(response => {
            if(response.rscode === 200){
                const { user } = response;
                
                dispatch(setLoggedIn(user));

                localStorage[`${process.env.REACT_APP_LS_NAME}`] = JSON.stringify(user);
            }else{
                return Promise.reject(response);
            }
        })

export const setLoggedIn = (user) => async dispatch => {
    dispatch({
        type: SET_LOGGED_IN,
        user
    })

    const payload = {
        levelid: user.levelid,
        userid: user.userid,
        token: user.token
    }

    try {
        const menu = await api.referensi.getMenu(payload);

        if(menu.rscode === 200){
            const data = [...menu.result, ...defaultmenu];

            dispatch({
                type: GET_MENU,
                data
            })
        }
    } catch (error) {
        alert("get menu failed");
    }
}

export const setLoggedOut = () => dispatch => {
    dispatch({ type: SET_LOGGED_OUT })

    localStorage.removeItem(process.env.REACT_APP_LS_NAME);

    dispatch({ type: RESET_MENU })
}
