import React from 'react';
import { Redirect, Switch } from 'react-router-dom'
import { UserRoute } from "./authroutes";
import { MinLayout } from "./layouts";
import { Home } from "./views";

const Routes = props => {
    return(
        <Switch>
            <Redirect from="/" to="/home" exact />
            <UserRoute path="/home" exact component={Home} layout={MinLayout}/>
        </Switch>
    )
}

export default Routes;