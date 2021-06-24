import { SET_LOADING_PROGERES } from "../types";

export const setLoadingProgress = (percentage) => dispatch => 
    dispatch({
        type: SET_LOADING_PROGERES,
        percentage
    })