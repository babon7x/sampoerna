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

//this route form menu in sidebar 
//so we need to find menu is exist or not
const UserRoute = props => {
    const classes = useStyles();
    const { isAuthenticated, menu, layout: Layout, component: Component, ...rest } = props;

    const menuisExist = menu.find(row => row.path === props.path);

    if(props.mount){
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
    }else{
        return (
            <Layout>
                <Backdrop className={classes.backdrop} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Layout>
        );
    }
}

UserRoute.propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    menu: PropTypes.array.isRequired,
    mount: PropTypes.bool.isRequired,
}

function mapStateToProps(state){
    return{
        isAuthenticated: !!state.auth.email,
        menu: state.menu,
        mount: state.mount
    }
}

export default connect(mapStateToProps, null)(UserRoute);