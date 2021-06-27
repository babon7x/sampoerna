import React from 'react';
import { Redirect, Switch } from 'react-router-dom'
import { UserRoute, GuestRoute } from "./authroutes";
import { MinLayout } from "./layouts";
import { Home, Login, Users, AddUser } from "./views";

const Routes = props => {
    return(
        <Switch>
            <Redirect from="/" to="/login" exact />
            <UserRoute path="/home" exact component={Home} layout={MinLayout}/>
            <GuestRoute path="/login" exact component={Login} layout={MinLayout}/>
            <UserRoute path="/users" exact component={Users} layout={MinLayout}/>
            <UserRoute path="/users/add" exact component={AddUser} layout={MinLayout}/>
        </Switch>
    )
}

export default Routes;