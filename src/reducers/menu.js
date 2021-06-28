import { GET_MENU, RESET_MENU } from "../types";
import defaultmenu from '../json/defaultmenu.json';

export default function menu(state=defaultmenu, action={}){
    switch(action.type){
        case GET_MENU:
            return action.data;
        case RESET_MENU:
            return defaultmenu;
        default:
            return state;
    }
}