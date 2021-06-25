import { 
    Typography, 
    CssBaseline, 
    Grow, 
    makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Alert } from '@material-ui/lab';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'


const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(3)
    },
    alert: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 10
    }
}))

const Home = props => {
    const classes = useStyles();
    const { user } = props;

    const [open, setOpen] = useState(true);

    useEffect(() => {
        if(open){
            setTimeout(() => {
                setOpen(false);
            }, 3000);
        }
    }, [open]);
    
    return(
        <div className={classes.root}>
            <CssBaseline />

            <Grow in={open} timeout={500}>
                <Alert severity='success' variant='filled' className={classes.alert}>
                    Selamat datang kembali { user.fullname }
                </Alert>
            </Grow>

            <Typography color='textPrimary'>Hey there!!</Typography>
        </div>
    )
}

Home.propTypes = {
    user: PropTypes.object.isRequired,
}

function mapStateToProps(state){
    return{
        user: state.auth
    }
}

export default connect(mapStateToProps, null)(Home);