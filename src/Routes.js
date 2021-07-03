import React from 'react';
import { Redirect, Switch } from 'react-router-dom'
import { UserRoute, GuestRoute, BothRoute, AllUserRoute } from "./authroutes";
import { MinLayout } from "./layouts";
import {  Home,  Login, Users, AddUser, Profile, Registrasi, Purchase, ListPo, Order, History, NotFound } from "./views";

const Routes = props => {
    return(
        <Switch>
            <Redirect from="/" to="/login" exact />
            <AllUserRoute path="/home" exact component={Home} layout={MinLayout}/>
            <GuestRoute path="/login" exact component={Login} layout={MinLayout}/>
            <UserRoute path="/users" exact component={Users} layout={MinLayout}/>
            <UserRoute path="/users/add" exact component={AddUser} layout={MinLayout}/>
            <AllUserRoute path="/profile" exact component={Profile} layout={MinLayout}/>
            <GuestRoute path="/registrasi" exact component={Registrasi} layout={MinLayout}/>
            <UserRoute path="/purchase" exact component={Purchase} layout={MinLayout}/>
            <UserRoute path="/purchase/list" exact component={ListPo} layout={MinLayout}/>
            <UserRoute path="/order" exact component={Order} layout={MinLayout}/>
            <UserRoute path="/order/list" exact component={History} layout={MinLayout}/>
            <BothRoute path="/not-found" exact component={NotFound} />
            <Redirect to="/not-found" />
        </Switch>
    )
}

export default Routes;