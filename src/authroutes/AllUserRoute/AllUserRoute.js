import { Redirect, Route } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import React from 'react';

//this route for menu not exist in side bar
const AllUserRoute = props => {
    const { isAuthenticated, layout: Layout, component: Component, ...rest } = props;

    return(
        <Route 
            { ...rest }
            render={matchProps => (
                <Layout>
                    { isAuthenticated ?  <Component {...matchProps} /> : <Redirect to="/login" /> } 
                </Layout>
            )}
        />
    )
}

AllUserRoute.propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    menu: PropTypes.array.isRequired,
}

function mapStateToProps(state){
    return{
        isAuthenticated: !!state.auth.email
    }
}

export default connect(mapStateToProps, null)(AllUserRoute);