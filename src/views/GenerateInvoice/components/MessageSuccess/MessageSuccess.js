import { Grid, Link, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types'
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    root: {
        height: '60vh'
    },
    link: {
        cursor: 'pointer',
        fontWeight: 'bold',
        color: 'red'
    }
}))

const MessageSuccess = props => {
    const classes = useStyles();

    return(
        <Grid container spacing={2} justify='center' alignItems='center' className={classes.root}>
            <Grid item xs={12} sm={8} md={6}>
                <Alert variant='filled' color='info' onClose={props.handleClose}>
                    <AlertTitle>{ props.message }</AlertTitle> 
                    Silahkan klik <Link onClick={props.onPrint} className={classes.link} underline='none'>disini</Link> untuk cetak invoice. Atau anda bisa mencetaknya
                    nanti dimenu laporan invoice
                </Alert>
            </Grid>
        </Grid>
    )
}

MessageSuccess.propTypes = {
    message: PropTypes.string,
    onPrint: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
}

export default MessageSuccess;