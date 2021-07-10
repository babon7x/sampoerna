import { GET_MENU, RESET_MENU } from "../types";

export default function menu(state=[], action={}){
    switch(action.type){
        case GET_MENU:
            return action.data;
        case RESET_MENU:
            return [];
        default:
            return state;
    }
}