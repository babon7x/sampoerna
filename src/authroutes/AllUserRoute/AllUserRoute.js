import { Redirect, Route } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import React from 'react';
import { Backdrop, makeStyles } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}));
//this route for menu not exist in side bar
const AllUserRoute = props => {
    const classes = useStyles();
    const { isAuthenticated, layout: Layout, component: Component, ...rest } = props;

    if(props.mount){
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
    }else{
        return(
            <Layout>
                <Backdrop className={classes.backdrop} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Layout>
        )
    }
}

AllUserRoute.propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    menu: PropTypes.array.isRequired,
    mount: PropTypes.bool.isRequired,
}

function mapStateToProps(state){
    return{
        isAuthenticated: !!state.auth.email,
        mount: state.mount
    }
}

export default connect(mapStateToProps, null)(AllUserRoute);