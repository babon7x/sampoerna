import { ADD_USER, COUNT_USERS, GET_USERS } from "../types";

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
        case ADD_USER:
            return {
                ...state,
                data: { ...state.data, [action.page]: [action.data, ...state.data[action.page]]}
            }
        default:
            return state;
    }
}