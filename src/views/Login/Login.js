import { Button, Collapse, FormControl, Grid, Link, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { login } from '../../actions/auth';
import { Alert } from '@material-ui/lab';


const useStyles = makeStyles(theme => ({
    root: {
        height: '90vh'
    },
    content: {
        textAlign: 'center',
        position: 'relative',
        padding: 10
    },
    form: {
        '& > *': {
            marginBottom: theme.spacing(2)
        },
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        textAlign: 'center',
        marginBottom: theme.spacing(4)
    },
    footer: {
        textAlign: 'center',
        marginTop: theme.spacing(4)
    },
    link: {
        color: '#82b1ff'
    }
}))

const Login = props => {
    const classes = useStyles();
    const [field, setField] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(field);
        setErrors(errors);
        if(Object.keys(errors).length === 0){
            setLoading(true);
            props.setLoadingProgress(10);

            try {
                await props.login(field);
                props.history.push("/home");
            } catch (err) {
                if(err.rscode){
                    const { message } = err;
                    if(message.global){
                        setErrors({ global: `Opps! ${err.message.global}`});
                    }else{
                        props.setLoadingProgress(100);
                        setErrors(message);
                    }
                }else{
                    props.setLoadingProgress(100);
                    setErrors({ global: `Opps, something wrong! response code ${err.request.status}`})
                }
            }

            setLoading(false);
        }
    }

    const validate = (values) => {
        const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

        const errors = {};
        if(!values.email) errors.email = "Email kamu belum diisi";
        if(values.email && !regexEmail.test(values.email)) errors.email = "Email tidak valid";
        if(!values.password) errors.password = "Password tidak boleh kosong";
        return errors;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setField(prevState => ({
            ...prevState,
            [name]: value
        }))

        setErrors(prevState => ({
            ...prevState,
            [name]: undefined
        }))
    }

    return(
        <Grid 
            container 
            justify='center' 
            alignItems='center' 
            className={classes.root}
        >
            <Grid item xs={11} sm={8} md={4}>
                <Typography variant='h6' color='textPrimary' className={classes.title}>
                    Selamat datang!
                    <Typography variant='subtitle2'>Untuk memulai silahkan login terlebih dahulu atau jika
                    tidak memiliki akun silahkan registrasi <Link className={classes.link} component={NavLink} to="/registrasi">disini</Link></Typography>
                </Typography> 

                <Collapse in={!!errors.global} timeout={500}>
                    <Alert variant='filled' severity='error' style={{marginBottom: 20}} onClose={() => setErrors(prev => ({ ...prev, global: undefined }))}>
                        { errors.global }
                    </Alert>
                </Collapse>

                <form className={classes.form} onSubmit={handleSubmit}>
                    <FormControl fullWidth>
                        <TextField 
                            label='Email'
                            variant='outlined'
                            placeholder='Masukkan email kamu'
                            InputLabelProps={{shrink: true}}
                            value={field.email}
                            name='email'
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email ? errors.email : null }
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField 
                            label='Password'
                            type='password'
                            variant='outlined'
                            placeholder='Password'
                            name='password'
                            value={field.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password ? errors.password : null }
                        />
                    </FormControl>
                    <div>
                        <Button 
                            variant='contained' 
                            fullWidth 
                            size='large' 
                            type='submit'
                            disabled={loading}
                        >
                            { loading ? 'Loading...' : 'LOGIN' }
                        </Button>
                    </div>
                </form>
                <div className={classes.footer}>
                    <Typography color='textSecondary' variant='caption'>
                        COPYRIGHT @2021 PT. HM SAMPOERNA <br/><br/>
                        <Typography variant='caption'>POWERED BY <br/>PT POSINDONESIA</Typography>
                    </Typography>
                </div>
            </Grid>
        </Grid>
    )
}

Login.propTypes = {
    setLoadingProgress: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
}

export default connect(null, { setLoadingProgress, login })(Login);