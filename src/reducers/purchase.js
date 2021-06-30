import { COUNT_PURCHASE, GET_PURCHASE } from "../types";

const initialState = {
    total: 0,
    data: {}
};

export default function purchase(state=initialState, action={}){
    switch(action.type){
        case COUNT_PURCHASE:
            return { ...state, total: action.list }
        case GET_PURCHASE:
            return { ...state, data: { ...state.data, [action.page] : action.list }}
        default:
            return state;
    }
}