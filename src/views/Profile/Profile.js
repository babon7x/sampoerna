import { 
    Grid, 
    makeStyles, 
    Card, 
    CardHeader, 
    Container, 
    CardActions,
    Divider,
    Button,
    ListItemText,
    IconButton
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { animated, useSpringRef, useTransition } from 'react-spring';
import { setLoggedOut } from '../../actions/auth';
import PropTypes from 'prop-types'
import { ConfirmModal } from '../../components'
import { DialogContentText } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { Icon } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2)
    },
    card: {
        margin: theme.spacing(2)
    },
    grid: {
        height: '80vh'
    }
}))

const Profile = props => {
    const { session } = props;
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
                <Grid container spacing={4} justify='center' alignItems='center' className={classes.grid}>
                    <Grid item xs={12} sm={8} md={5}>
                        <Card className={classes.card}>
                            <CardHeader 
                                title='Profile' 
                                subheader={session.email} 
                                action={<IconButton>
                                    <Icon>edit</Icon>
                                </IconButton>}
                            />
                            <Divider />
                            <List>
                                <ListItem dense>
                                    <ListItemText 
                                        primary='Nama' 
                                        secondary={session.fullname}
                                    />                                    
                                </ListItem>
                                <ListItem dense>
                                    <ListItemText 
                                        primary='Phone' 
                                        secondary={session.phone}
                                    />
                                </ListItem>
                                <ListItem dense>
                                    <ListItemText 
                                        primary='Pos Office' 
                                        secondary={`KPRK - ${session.office}`}
                                    />
                                </ListItem>
                                { Object.keys(session.details).length > 0 && <ListItem dense>
                                    <ListItemText 
                                        primary='Office' 
                                        secondary={<React.Fragment>
                                            {`${session.details.city}, ${session.details.kecamatan}, ${session.details.kelurahan} (${session.details.kodepos})`}
                                            <br/>
                                            { session.details.address}
                                        </React.Fragment>}
                                    />
                                </ListItem>}
                            </List>
                            <CardActions style={{justifyContent: 'flex-end'}}>
                                <Button variant='outlined' onClick={() => setOpen(true)}>Ganti Password</Button>
                                <Button variant='outlined' onClick={() => setOpen(true)}>Logout</Button>
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
    session: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return{
        session: state.auth
    }
}

export default connect(mapStateToProps, { setLoggedOut })(Profile);