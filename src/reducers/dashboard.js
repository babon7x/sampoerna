import resultorder from '../json/resultorder.json';
import { GET_PO_USED, GET_RESULT_ORDER } from '../types';

const initialState = {
    resultorder,
    poused: []
}

export default function dashboard(state=initialState, action={}) {
    switch(action.type){
        case GET_RESULT_ORDER:
            return { ...state, resultorder: action.result }
        case GET_PO_USED:
            return { ...state, poused: action.result }
        default:
            return state;
    }
}