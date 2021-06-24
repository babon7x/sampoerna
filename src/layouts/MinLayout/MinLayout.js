import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

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

    return(
        <React.Fragment>
            <AppBar position="static" color='default' elevation={0}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        PT SAMPOERNA
                    </Typography>
                </Toolbar>
            </AppBar>
            {props.children}
        </React.Fragment>
    )
}

MinLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default MinLayout;