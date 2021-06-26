import { SET_MESSAGE } from "../types";

const initialState = {
    open: false,
    text: '',
    variant: 'error'
}

export default function message(state=initialState, action={}){
    switch(action.type){
        case SET_MESSAGE:
            return { ...state, ...action.message, text: action.message.text ? action.message.text : state.text }
        default:
            return state;
    }
}