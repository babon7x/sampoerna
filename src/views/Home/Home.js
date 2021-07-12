import { 
    Card,
    Container,
    Grid,
    Grow, 
    makeStyles,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { ResultOrder, PoUsed } from './components';
import { getResultOrder, getPoUsed } from '../../actions/dashboard';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { setMessage } from '../../actions/notification';
import { animated, useSpringRef, useTransition } from 'react-spring';


const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2)
    },
    alert: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 10,
        zIndex: theme.zIndex.drawer + 1
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
        (async () => {
            props.setLoadingProgress(20);
            const { token, userid, details } = user;
            try {
                await props.getResultOrder({ token, userid });
                props.setLoadingProgress(50);

                await props.getPoUsed({ token, userid, officeid: details.officeid });
            } catch (error) {
                props.setMessage(error, true, 'error');
            }
            props.setLoadingProgress(100);
        })();
        //eslint-disable-next-line
    }, []);
    
    return transitions(style => <animated.div style={{ ...style }} className={classes.root}>
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ResultOrder list={props.orders} />
                        </Grid>
                        <Grid item xs={12}>
                            <Card style={{height: '68.2vh'}} raised>
                                <p>grph</p>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <PoUsed list={props.purchases} onClick={() => props.history.push("/purchaselist")} />
                </Grid>
            </Grid>
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
}

function mapStateToProps(state){
    return{
        user: state.auth,
        orders: state.dashboard.resultorder,
        purchases: state.dashboard.poused
    }
}

export default connect(mapStateToProps, { 
    getResultOrder, 
    setLoadingProgress, 
    setMessage,
    getPoUsed 
})(Home);