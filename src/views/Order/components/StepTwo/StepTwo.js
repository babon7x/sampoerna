import { animated, useSpringRef, useTransition } from 'react-spring';
import React, { useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types'

const StepTwo = props => {
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
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onSubmit(2);
    }

    return (
        <form onSubmit={handleSubmit}>
            {transitions(style => <animated.div style={{ ...style }}>
                <Grid container spacing={2} justify='center'>
                    <Grid item xs={12} sm={6}>
                        <Typography style={{textAlign: 'center'}}>
                            Step 2
                        </Typography>
                        <Button onClick={props.goBack}>BACK</Button>
                        <Button type='submit'>NEXT</Button>
                    </Grid>
                </Grid>
            </animated.div>)}
        </form>
    ) 

}

StepTwo.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
}

export default StepTwo;