import { combineReducers } from "redux";
import auth from './reducers/auth';
import loadingprogress from './reducers/loadingprogress'

export default combineReducers({
    auth,
    loadingprogress
})