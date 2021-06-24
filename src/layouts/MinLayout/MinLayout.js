import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { ProgressLoader } from "../../components";
import { connect } from 'react-redux';
import { setLoadingProgress } from '../../actions/loadingprogress';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    }
}))

const MinLayout = props => {
    const classes = useStyles();

    useEffect(() => {
        if(props.loadingprogress === 100){
            setTimeout(() => {
                props.setLoadingProgress(0);
            }, 800);
        }
        //eslint-disable-next-line
    }, [props.loadingprogress]);

    return(
        <React.Fragment>
            { props.loadingprogress > 0 && <ProgressLoader percentage={props.loadingprogress} /> }
            <AppBar position="static" color='default' elevation={0}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        SOME TITLE HERE
                    </Typography>
                </Toolbar>
            </AppBar>
            {props.children}
        </React.Fragment>
    )
}

MinLayout.propTypes = {
    children: PropTypes.node.isRequired,
    loadingprogress: PropTypes.number.isRequired,
    setLoadingProgress: PropTypes.func.isRequired
}

function mapStateToProps(state){
    return{
        loadingprogress: state.loadingprogress
    }
}

export default connect(mapStateToProps, {
    setLoadingProgress
})(MinLayout);