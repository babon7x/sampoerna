import { COUNT_USERS, GET_USERS } from "../types";

const initialState = {
    total: 0,
    data: {}
}

export default function users(state=initialState, action={}){
    switch(action.type){
        case COUNT_USERS:
            return { ...state, total: action.data }
        case GET_USERS:
            return {
                ...state,
                data: { ...state.data, [action.page]: action.data }
            }
        default:
            return state;
    }
}