import { combineReducers } from "redux";
import auth from './reducers/auth';
import loadingprogress from './reducers/loadingprogress'
import menu from './reducers/menu'
import region from './reducers/region';
import users from './reducers/users';
import message from './reducers/message';
import levels from './reducers/levels';
import purchase from './reducers/purchase';
import orders from './reducers/orders';
import mount from './reducers/mount';

export default combineReducers({
    auth,
    loadingprogress,
    menu,
    region,
    users,
    message,
    levels,
    purchase,
    orders,
    mount
})