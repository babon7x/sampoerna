import { Button, FormControl, Grid, makeStyles, Typography, TextField, Link } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { animated, useSpringRef, useTransition } from 'react-spring';
import api from '../../services/api';
import { setMessage } from '../../actions/notification';
import PropTypes from 'prop-types'
import { Autocomplete } from '@material-ui/lab';
import { setLoadingProgress } from '../../actions/loadingprogress';

const useStyles = makeStyles(theme => ({
    root: {
        height: '90vh'
    },
    title: {
        textAlign: 'center',
        marginBottom: theme.spacing(4)
    },
    form: {
        '& > *': {
            marginBottom: theme.spacing(2)
        },
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    link: {
        marginTop: theme.spacing(2),
        textDecoration: 'none'
    }
}));

const Registrasi = props => {
    const classes = useStyles();
    const transRef = useSpringRef();
    const transitions = useTransition(null, {
        ref: transRef,
        keys: null,
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    })
    const [offices, setOffices] = useState([]);
    const [field, setField] = useState({
        email: '',
        fullname: '',
        phone: '',
        officeid: '',
        password: '',
        confirmpass: ''
    })
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const offices = await api.referensi.getOffice({ type: 'hmsampoerna' })
                if(offices.rscode === 200){
                    setOffices(offices.data);
                }else{
                    props.setMessage(offices, true, 'error');
                }
            } catch (error) {
                props.setMessage(error, true, 'error');
            }
        })();
        transRef.start();
        //eslint-disable-next-line
    }, [])

    const handleChangeAutoComplete = (value) => {
        setField(prev => ({ ...prev, officeid: value ? value.officeid : '' }));
        if(value){
            setErrors(prev => ({ ...prev, officeid: undefined }));
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setField(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(field);

        if(Object.keys(errors).length === 0){
            props.setLoadingProgress(10);
            setLoading(true);
            try {
                const registrasi = await api.user.registrasi(field);
                if(registrasi.rscode === 200){
                    props.setMessage({ text: registrasi.message }, true, 'success');
                    props.history.push("/login");
                }else{
                    props.setMessage(registrasi, true, 'error');
                }
            } catch (error) {
                props.setMessage(error, true, 'error');
            }
            setLoading(false);
        }

        setErrors(errors);
    }

    const validate = (values) => {
        const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        //const regexPhone = /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/

        const errors = {};
        if(!values.fullname) errors.fullname = "Nama lengkap harus diisi";
        if(!values.email) errors.email = "Email harus diisi";
        if(!values.phone) errors.phone = "Nomor handphone harus diisi";
        if(!values.officeid) errors.officeid = "Kantor belum dipilih";
        if(values.email && !regexEmail.test(values.email)) errors.email = "Email tidak valid";
        //if(values.phone && !regexPhone.test(values.phone)) errors.phone = "Nomor hp tidak valid, mohon input dalam format 08XX-XXXX-XXXX";
        if(!values.password) errors.password = "Password harus diisi";
        if(values.password){
            if(!values.confirmpass) errors.confirmpass = "Konfirmasi password anda";
            if(values.confirmpass){
                if(values.confirmpass !== values.password) errors.confirmpass = "Password tidak valid";
            }
            if(values.password.length <= 6) errors.password = "Password harus lebih dari 6 karakter";
        }
        
        return errors;
    }


    return transitions(styles => {
        return <animated.div style={{ ...styles }}>
            <Grid 
                container 
                justify='center' 
                alignItems='center' 
                className={classes.root}
            >
                <Grid item xs={11} sm={8} md={6}>
                    <Typography variant='body1' style={{textAlign: 'center'}}>Silahkan lengkapi data anda dibawah ini</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={12} md={12}>
                                <FormControl fullWidth>
                                    <TextField 
                                        variant='outlined'
                                        label='Nama Lengkap'
                                        placeholder='Nama lengkap anda'
                                        InputLabelProps={{shrink: true}}
                                        name='fullname'
                                        value={field.fullname}
                                        onChange={handleChange}
                                        error={!!errors.fullname}
                                        helperText={errors.fullname ? errors.fullname : null }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <FormControl fullWidth>
                                    <TextField 
                                        variant='outlined'
                                        label='Email'
                                        placeholder='Masukkan email anda'
                                        InputLabelProps={{shrink: true}}
                                        name='email'
                                        value={field.email}
                                        onChange={handleChange}
                                        error={!!errors.email}
                                        helperText={errors.email ? errors.email : null }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6}>
                                <FormControl fullWidth>
                                    <TextField 
                                        variant='outlined'
                                        label='Phone'
                                        placeholder='Masukkan nomor handpohne'
                                        InputLabelProps={{shrink: true}}
                                        name='phone'
                                        value={field.phone}
                                        onChange={handleChange}
                                        error={!!errors.phone}
                                        helperText={errors.phone ? errors.phone : null}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        id="officelist"
                                        options={offices}
                                        getOptionLabel={(option) => option.officename}
                                        onChange={(e, value) => handleChangeAutoComplete(value)}
                                        renderInput={(params) => 
                                            <TextField 
                                                {...params} 
                                                label="Kantor"
                                                InputLabelProps={{shrink: true}} 
                                                variant="outlined" 
                                                placeholder='Cari kantor'
                                                error={!!errors.officeid}
                                                helperText={errors.officeid ? errors.officeid : null }
                                            />}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    
                        <FormControl fullWidth>
                            <TextField 
                                variant='outlined'
                                label='Password'
                                placeholder='Masukkan password'
                                InputLabelProps={{shrink: true}}
                                name='password'
                                value={field.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password ? errors.password : 'Gunakan 6 karakter atau lebih dengan gabungan hurup dan angka!'}
                                type='password'
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField 
                                variant='outlined'
                                label='Konfirmasi password'
                                placeholder='Masukkan ulang password anda'
                                InputLabelProps={{shrink: true}}
                                name='confirmpass'
                                value={field.confirmpass}
                                onChange={handleChange}
                                error={!!errors.confirmpass}
                                helperText={errors.confirmpass ? errors.confirmpass : null }
                                type='password'
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
                                { loading ? 'Loading...' : 'REGISTRASI SEKARANG' } 
                            </Button>
                            <div className={classes.link}>
                                <Link underline='none' component={NavLink} to="/login">Kembali login</Link>
                            </div>
                        </div>
                    </form>
                </Grid>
            </Grid>
        </animated.div>
    })
}

Registrasi.propTypes = {
    setMessage: PropTypes.func.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
}

export default connect(null, { setMessage, setLoadingProgress })(Registrasi);