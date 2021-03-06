import api from "../services/api";
import { GET_MENU, RESET_MENU, SET_LOGGED_IN, SET_LOGGED_OUT, SET_MOUNT } from "../types";
// import defaultmenu from '../json/defaultmenu.json';

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
    
            dispatch({
                type: GET_MENU,
                data: menu.result
            })

            dispatch({ type: SET_MOUNT, mountvalue: true });
        }
    } catch (error) {
        alert("get menu failed");
    }
}

export const setLoggedOut = () => dispatch => {
    dispatch({ type: SET_LOGGED_OUT })

    localStorage.removeItem(process.env.REACT_APP_LS_NAME);

    dispatch({ type: RESET_MENU })

    //notes 
    //login route must not have mount state
    setTimeout(() => {
        dispatch({ type: SET_MOUNT, mountvalue: false });
    }, 500);    
}
