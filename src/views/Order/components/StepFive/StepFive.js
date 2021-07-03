import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Grid, Link, makeStyles } from '@material-ui/core';
import { animated, useSpringRef, useTransition } from 'react-spring';
import { Alert } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import { decimalNumber } from '../../../../utils';

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        justifyContent: 'center'
    },
    content: {
        margin: theme.spacing(2)
    },
    link: {
        cursor: 'pointer'
    }
}))

const StepFive = props => {
    const { stepFourData } = props;
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
    }, []);

    const handleSubmit = (type) => {
        const parameter = {
            ispickup: type === 2 ? true : false
        }

        props.onSubmit(5, parameter);
    }

    return transitions(style => <animated.div style={{ ...style }}>
            <Grid container spacing={2} justify='center'>
                <Grid item xs={12} sm={6}>
                    { Object.keys(stepFourData).length > 0 && <Alert variant='outlined' severity='success' color='warning' style={{marginTop: 7, marginBottom: 7}}>
                        Produk yang dipilih <strong>({stepFourData.fee.serviceCode}) {stepFourData.fee.serviceName}</strong> - Rp. {decimalNumber(stepFourData.fee.totalFee)}
                        &nbsp;<Link underline='none' onClick={props.goBack} className={classes.link}>ganti produk</Link>
                    </Alert> }

                    <div className={classes.content}>
                        <Typography align='center' variant='body1'>Apakah anda ingin mempickup langsung kiriman ini?</Typography>
                    </div>
                    <div className={classes.footer}>
                        <ButtonGroup disableElevation variant="contained" fullWidth style={{maxWidth: '50%'}}>
                            <Button onClick={() => handleSubmit(1)}>Nanti</Button>
                            <Button onClick={props.goBack}>Ya</Button>
                        </ButtonGroup>
                    </div>
                </Grid>
            </Grid>
        </animated.div>
    )
}

StepFive.propTypes = {
    goBack: PropTypes.func.isRequired,
    stepFourData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default StepFive;