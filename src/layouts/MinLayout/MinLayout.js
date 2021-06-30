import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CssBaseline, AppBar, IconButton, makeStyles, SwipeableDrawer, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { ProgressLoader, Notification } from "../../components";
import { connect } from 'react-redux';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { SidebarMenu } from './components';
import { setMessage } from '../../actions/notification';

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
    },
    content: {
        margin: 10,
        flexGrow: 1,
    },
    appBar: {
        backgroundColor: '#303030', 
        color: '#FFF'
    },
    toolbar: theme.mixins.toolbar,
}))

const MinLayout = props => {
    const { notification } = props;
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
            <AppBar position='fixed' className={classes.appBar} elevation={0}>
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
            <CssBaseline />
            <div className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
            </div>
            <Notification 
                open={notification.open}
                message={notification.text}
                handleClose={() => props.setMessage(null, false, notification.variant) }
                variant={notification.variant}
            />
        </React.Fragment>
    )
}

MinLayout.propTypes = {
    children: PropTypes.node.isRequired,
    loadingprogress: PropTypes.number.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    menus: PropTypes.array.isRequired,
    notification: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired
}

function mapStateToProps(state){
    return{
        loadingprogress: state.loadingprogress,
        menus: state.menu,
        user: state.auth,
        notification: state.message
    }
}

export default connect(mapStateToProps, {
    setLoadingProgress,
    setMessage
})(MinLayout);