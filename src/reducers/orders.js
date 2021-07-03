import { COUNT_ORDER, GET_ORDER, RESET_ORDER } from "../types";

const initialState = {
    total: 0,
    data: {}
}

export default function orders(state=initialState, action={}){
    switch(action.type){
        case COUNT_ORDER:
            return { ...state, total: action.data }
        case GET_ORDER:
            return { ...state, data: { ...state.data, [action.page]: action.data }}
        case RESET_ORDER:
            return { ...state, total: 0, data: {} }
        default:
            return state;
    }
}