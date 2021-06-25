import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AppBar, IconButton, makeStyles, SwipeableDrawer, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { ProgressLoader } from "../../components";
import { connect } from 'react-redux';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { SidebarMenu } from './components';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    list: {
        width: 250
    }
}))

const MinLayout = props => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(props.loadingprogress === 100){
            setTimeout(() => {
                props.setLoadingProgress(0);
            }, 800);
        }
        //eslint-disable-next-line
    }, [props.loadingprogress]);

    const toogleDrawer = (open) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(open);
    }

    const list = () => (
        <SidebarMenu 
            toogleDrawer={toogleDrawer}
            list={props.menus}
            user={props.user}
        />
    );

    return(
        <React.Fragment>
            { props.loadingprogress > 0 && <ProgressLoader percentage={props.loadingprogress} /> }
            <AppBar position="static" color='default' elevation={0}>
                <Toolbar>
                    <IconButton 
                        edge="start" 
                        className={classes.menuButton} 
                        color="inherit" 
                        aria-label="menu"
                        onClick={toogleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        SOME TITLE HERE
                    </Typography>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                anchor='left'
                open={open}
                onClose={toogleDrawer(false)}
                onOpen={toogleDrawer(true)}
            >
                { list() }
            </SwipeableDrawer>
            {props.children}
        </React.Fragment>
    )
}

MinLayout.propTypes = {
    children: PropTypes.node.isRequired,
    loadingprogress: PropTypes.number.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    menus: PropTypes.array.isRequired
}

function mapStateToProps(state){
    return{
        loadingprogress: state.loadingprogress,
        menus: state.menu,
        user: state.auth
    }
}

export default connect(mapStateToProps, {
    setLoadingProgress
})(MinLayout);