import { SET_LOGGED_IN, SET_LOGGED_OUT } from "../types";

export default function auth(state={}, action={}){
    switch(action.type){
        case SET_LOGGED_IN:
            return action.user;
        case SET_LOGGED_OUT:
            return {};
        default:
            return state;
    }
}