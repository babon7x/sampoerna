import { SET_MOUNT } from "../types";

export default function mount(state=false, action={}){
    switch(action.type){
        case SET_MOUNT:
            return action.mountvalue;
        default:
            return state;
    }
}