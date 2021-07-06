import { COUNT_INVOICE, GET_INVOICE } from "../types";

const initialState = {
    total: 0,
    data: {}
}

export default function invoice(state=initialState, action={}){
    switch(action.type){
        case COUNT_INVOICE:
            return { ...state, total: action.result }
        case GET_INVOICE:
            return { ...state, data: { ...state.data, [action.page]: action.result }}
        default:
            return state;
    }
}