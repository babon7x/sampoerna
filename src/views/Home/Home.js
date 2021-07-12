import { 
    Card,
    Container,
    Grid,
    Grow, 
    makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Alert } from '@material-ui/lab';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { ResultOrder, PoUsed } from './components';
import { getResultOrder } from '../../actions/dashboard';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { setMessage } from '../../actions/notification';


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

    const [open, setOpen] = useState(true);

    useEffect(() => {
        if(open){
            setTimeout(() => {
                setOpen(false);
            }, 3000);
        }
    }, [open]);

    useEffect(() => {
        (async () => {
            props.setLoadingProgress(10);
            const { token, userid } = user;
            try {
                await props.getResultOrder({ token, userid });
            } catch (error) {
                props.setMessage(error, true, 'error');
            }
            props.setLoadingProgress(100);
        })();
        //eslint-disable-next-line
    }, []);
    
    return(
        <div className={classes.root}>
            <Grow in={open} timeout={500}>
                <Alert severity='success' variant='filled' className={classes.alert}>
                    Selamat datang kembali { user.fullname }
                </Alert>
            </Grow>

            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <ResultOrder list={props.orders} />
                            </Grid>
                            <Grid item xs={12}>
                                <Card style={{height: '67vh'}} raised>
                                    <p>grph</p>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <PoUsed />
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

Home.propTypes = {
    user: PropTypes.object.isRequired,
    orders: PropTypes.array.isRequired,
    getResultOrder: PropTypes.func.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
}

function mapStateToProps(state){
    return{
        user: state.auth,
        orders: state.dashboard.resultorder
    }
}

export default connect(mapStateToProps, { getResultOrder, setLoadingProgress, setMessage })(Home);