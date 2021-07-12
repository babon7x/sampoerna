import resultorder from '../json/resultorder.json';
import { GET_RESULT_ORDER } from '../types';

const initialState = {
    resultorder,
    anotherdata: {}
}

export default function dashboard(state=initialState, action={}) {
    switch(action.type){
        case GET_RESULT_ORDER:
            return { ...state, resultorder: action.result }
        default:
            return state;
    }
}