import { combineReducers } from "redux";
import auth from './reducers/auth';
import loadingprogress from './reducers/loadingprogress'
import menu from './reducers/menu'
import region from './reducers/region';
import users from './reducers/users';
import message from './reducers/message';

export default combineReducers({
    auth,
    loadingprogress,
    menu,
    region,
    users,
    message
})