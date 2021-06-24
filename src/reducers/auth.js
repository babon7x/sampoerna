import { SET_LOGGED_IN } from "../types";

export default function auth(state={}, action={}){
    switch(action.type){
        case SET_LOGGED_IN:
            return action.user;
        default:
            return state;
    }
}