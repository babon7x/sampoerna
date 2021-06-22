import React from 'react';
import { Redirect, Switch } from 'react-router-dom'

const Routes = props => {
    return(
        <Switch>
            <Redirect from="/" to="/home" />
        </Switch>
    )
}

export default Routes;