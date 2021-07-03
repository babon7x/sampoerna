import { Redirect, Route } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import React from 'react';

//this route form menu in sidebar 
//so we need to find menu is exist or not
const UserRoute = props => {
    const { isAuthenticated, menu, layout: Layout, component: Component, ...rest } = props;

    const menuisExist = menu.find(row => row.path === props.path);

    return(
        <Route 
            { ...rest }
            render={matchProps => (
                <Layout>
                    { isAuthenticated ? <React.Fragment>
                            { menuisExist ? <Component {...matchProps} /> : <Redirect to="/not-found" />}
                        </React.Fragment> : <Redirect to="/login" /> } 
                </Layout>
            )}
        />
    )
}

UserRoute.propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    menu: PropTypes.array.isRequired,
}

function mapStateToProps(state){
    return{
        isAuthenticated: !!state.auth.email,
        menu: state.menu
    }
}

export default connect(mapStateToProps, null)(UserRoute);