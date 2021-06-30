import React, { useEffect, useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSpringRef, useTransition, animated } from 'react-spring';
import { InputButton } from '../../../../components';
import api from '../../../../services/api';

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(0.5)
        }
    },
    root: {
        margin: theme.spacing(2)
    }
}))


const StepOne = props => {
    const { usersession } = props;
    const classes = useStyles();
    const transRef = useSpringRef();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
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

    useEffect(() => {
        if(props.defaultValues.email){
            setEmail(props.defaultValues.email);
        }
    }, [props.defaultValues]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(email);
        setErrors(errors);
        if(Object.keys(errors).length === 0){
            try {
                const { token, userid } = usersession;

                const checking = await api.user.cekemail({ email, token, userid });
                if(checking.rscode === 200){
                    
                    props.onSubmit(1, checking.data);
                }else{
                    props.setMessage(checking, true, 'error');
                }
            } catch (error) {
                props.setMessage(error, true, 'error');
            }
        }
    }

    const validate = (values) => {
        const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        const errors = {}
        if(!values) errors.email = "Email belum diisi!";
        if(values && !regexEmail.test(values)) errors.email = "Email tidak valid";
        return errors;
    }

    return(
        <form onSubmit={handleSubmit}>
            { transitions(style => <animated.div style={{ ...style }} className={classes.root}>
                <Grid container spacing={2} justify='center'>
                    <Grid item xs={12} sm={8} md={6}>
                        <InputButton 
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
                            label='Email'
                            placeholder='Masukkan email terdaftar'
                            buttonlable='Cari'
                            isError={!!errors.email}
                            messageErr={errors.email}
                        />
                    </Grid>
                </Grid>
            </animated.div>) }
        </form>
    )
}

StepOne.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    usersession: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
    defaultValues: PropTypes.object.isRequired,
}

export default StepOne;