import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    alert: {
        minWidth: 250
    }
}))

function Alert(props) {
    const classes = useStyles();
    return <MuiAlert className={classes.alert} elevation={6} variant="filled" {...props} />;
}

const Notification = props => {
    const { message, variant } = props;

    return(
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={props.open}
            autoHideDuration={6000}
            onClose={props.handleClose}
        >
            <Alert onClose={props.handleClose} severity={variant}>
                { message }
            </Alert>
        </Snackbar>
    )
}

Notification.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    variant: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
}

export default Notification;