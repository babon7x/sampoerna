import { combineReducers } from "redux";
import auth from './reducers/auth';
import loadingprogress from './reducers/loadingprogress'
import menu from './reducers/menu'

export default combineReducers({
    auth,
    loadingprogress,
    menu
})