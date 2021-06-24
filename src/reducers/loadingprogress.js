import { SET_LOADING_PROGERES } from "../types";

export default function loadingprogress(state=0, action={}){
    switch(action.type){
        case SET_LOADING_PROGERES:
            return action.percentage
        default:
            return state;
    }
}