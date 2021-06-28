import { 
    Grid, 
    makeStyles, 
    Card, 
    CardHeader, 
    Container, 
    CardContent,
    CardActions,
    Divider,
    Button
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { animated, useSpringRef, useTransition } from 'react-spring';
import { setLoggedOut } from '../../actions/auth';
import PropTypes from 'prop-types'
import { ConfirmModal } from '../../components'
import { DialogContentText } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2)
    }
}))

const Profile = props => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const transRef = useSpringRef();
    const transitions = useTransition(null, {
        ref: transRef,
        keys: null,
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    })

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, [])

    const handleLogout = () => {
        setOpen(false);
        props.setLoggedOut();
    }

    return transitions(style => {
        return <animated.div style={{ ...style }} className={classes.root}>
            <Container>
                <ConfirmModal open={open} handleClose={() => setOpen(false)} onAggre={handleLogout}>
                    <DialogContentText style={{textAlign: 'center'}}>Apakah anda yakin untuk keluar dari aplikasi?</DialogContentText>
                </ConfirmModal>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader 
                                title='Profile'
                            />
                            <Divider />
                            <CardContent>
                                <p>content here!</p>
                            </CardContent>
                            <CardActions style={{justifyContent: 'center'}}>
                                <Button variant='contained' onClick={() => setOpen(true)}>Logout</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </animated.div>
    })
}

Profile.propTypes = {
    setLoggedOut: PropTypes.func.isRequired,
}

export default connect(null, { setLoggedOut })(Profile);