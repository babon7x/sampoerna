import { 
    Container,
    Grid,
    makeStyles,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { ResultOrder, PoUsed, Graph } from './components';
import { getResultOrder, getPoUsed, getPengeluaran } from '../../actions/dashboard';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { setMessage } from '../../actions/notification';
import { animated, useSpringRef, useTransition } from 'react-spring';
import { Alert, AlertTitle } from '@material-ui/lab';


const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2)
    },
    alert: {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '80vh'
    }
}))

const Home = props => {
    const classes = useStyles();
    const { user } = props;

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
        if(user.levelid === 'L3'){ //ae
            (async () => {
                props.setLoadingProgress(20);
                const { token, userid, details } = user;
                try {
                    await props.getResultOrder({ token, userid });
                    props.setLoadingProgress(50);
    
                    await props.getPoUsed({ token, userid, officeid: details.officeid });
                    props.setLoadingProgress(70);
    
                    await props.getPengeluaran({ token, userid, officeid: details.officeid });
                } catch (error) {
                    props.setMessage(error, true, 'error');
                }
                props.setLoadingProgress(100);
            })();
        }
        //eslint-disable-next-line
    }, [user.levelid]);
    
    return transitions(style => <animated.div style={{ ...style }} className={classes.root}>
        <Container>
            { user.levelid === 'L3' ? <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ResultOrder list={props.orders} />
                        </Grid>
                        <Grid item xs={12}>
                            <Graph data={props.pengeluaran} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <PoUsed list={props.purchases} onClick={() => props.history.push("/purchaselist")} />
                </Grid>
            </Grid> : <div className={classes.alert}>
                <Alert variant='filled' style={{width: '50%'}}>
                    <AlertTitle>Notifikasi</AlertTitle>
                    Selamat datang { user.level } ({ user.fullname })
                </Alert>
            </div> }
        </Container>
    </animated.div>)
}

Home.propTypes = {
    user: PropTypes.object.isRequired,
    orders: PropTypes.array.isRequired,
    getResultOrder: PropTypes.func.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    getPoUsed: PropTypes.func.isRequired,
    purchases: PropTypes.array.isRequired,
    pengeluaran: PropTypes.array.isRequired,
    getPengeluaran: PropTypes.func.isRequired,
}

function mapStateToProps(state){
    return{
        user: state.auth,
        orders: state.dashboard.resultorder,
        purchases: state.dashboard.poused,
        pengeluaran: state.dashboard.pengeluaran
    }
}

export default connect(mapStateToProps, { 
    getResultOrder, 
    setLoadingProgress, 
    setMessage,
    getPoUsed,
    getPengeluaran
})(Home);