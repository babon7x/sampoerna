import React, { useEffect, useState } from 'react';
import { Container, TextField, FormControl, Grid } from '@material-ui/core';
import { animated, useSpringRef, useTransition } from 'react-spring';
import { Typography, makeStyles } from '@material-ui/core';
import { MenuItem, Select, InputLabel, Button } from '@material-ui/core';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { FormHelperText } from '@material-ui/core';
import api from '../../services/api';
import { setMessage } from '../../actions/notification';
import { addData } from '../../actions/users';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    form: {
        margin: theme.spacing(2),
        marginTop: theme.spacing(4)
    },
    title: {
        textAlign: 'center'
    },
    root: {
        marginTop: theme.spacing(2)
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(2)
    }
}))

const AddUser = props => {
    const { levels, session, region } = props;
    const history = useHistory();
    const classes = useStyles();
    const [field, setField] = useState({
        fullname: '',
        levelid: '00',
        phone: '',
        reg: '00',
        kprk: '00'
    })
    const [errors, setErrors] = useState({});
    const [kprk, setKprk] = useState([]);
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

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setField(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));

        if(name === 'reg'){
            try {
                const datakprk = await api.referensi.getOffice({type: 'kprk', region: value });
                if(datakprk.rscode === 200){
                    setKprk(datakprk.data);
                    setField(prev => ({ ...prev, kprk: '00'}));
                }else{
                    props.setMessage(datakprk, true, 'error');
                }
            } catch (error) {
                props.setMessage(error);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validate(field);
        setErrors(errors);
        if(Object.keys(errors).length === 0){
            props.setLoadingProgress(10);

            const payload = {
                userid: session.userid,
                token: session.token,
                office: field.kprk,
                ...field
            }

            try {
                const add = await props.addData(payload);
                props.setMessage({ text: add.message }, true, 'success');

                setTimeout(() => {
                    history.goBack();
                }, 300);
            } catch (error) {
                props.setMessage(error, true, 'error');
                props.setLoadingProgress(100);
            }
        }
    }

    const validate = (values) => {
        const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        const regexPhone = /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/

        const errors = {};
        if(!values.fullname) errors.fullname = "Nama lengkap harus diisi";
        if(!values.email) errors.email = "Email harus diisi";
        if(!values.phone) errors.phone = "Nomor handphone harus diisi";
        if(values.levelid === '00') errors.levelid = "Level belum dipilih";
        if(values.email && !regexEmail.test(values.email)) errors.email = "Email tidak valid";
        if(values.phone && !regexPhone.test(values.phone)) errors.phone = "Nomor hp tidak valid, mohon input dalam format 08XX-XXXX-XXXX";
        if(values.reg === '00') errors.reg = "Regional belum dipilih";
        if(values.reg !== '00'){
            if(values.kprk === '00') errors.kprk = "Kprk belum dipilih";
        }
        return errors;
    }
    
    return(
        <React.Fragment>
            {transitions(style => {
                return <animated.div style={{ ...style }} className={classes.root}>
                    <Container>
                        <div className={classes.title}>
                            <Typography variant='h6'>Tambah Pengguna</Typography>
                            <Typography variant='body2'>Silahkan lengkapi form dibawah ini</Typography>
                        </div>
                        <form className={classes.form} onSubmit={handleSubmit}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant='outlined' error={!!errors.reg}>
                                        <InputLabel htmlFor='regionalid'>REGIONAL</InputLabel>
                                        <Select
                                            label='REGIONAL'
                                            labelId='regionalid'
                                            name='reg'
                                            value={field.reg}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value='00'><em>--pilih regional--</em></MenuItem>
                                            { region.map(row => <MenuItem key={row.id} value={row.id}>
                                                { row.wilayah }
                                            </MenuItem>)}
                                        </Select>
                                        { errors.reg && <FormHelperText>{errors.reg}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant='outlined' error={!!errors.kprk}>
                                        <InputLabel htmlFor='kprkid'>KPRK</InputLabel>
                                        <Select
                                            label='KPRK'
                                            labelId='kprkid'
                                            name='kprk'
                                            value={field.kprk}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value='00'>
                                                <em>--{field.reg === '00' ? 'pilih regional terlebih dahulu' : 'Pilih Kprk'}--</em>
                                            </MenuItem>
                                            { kprk.length > 0 && <MenuItem value={field.reg}>PENGGUNA REGIONAL {field.reg}</MenuItem>}
                                            { kprk.map(row => <MenuItem key={row.nopend} value={row.nopend}>
                                                { row.nopend } - {row.officename}
                                            </MenuItem>)}
                                        </Select>
                                        { errors.kprk && <FormHelperText>{errors.kprk}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            variant='outlined'
                                            label='Nama lengkap'
                                            placeholder='Masukkan nama lengkap'
                                            InputLabelProps={{shrink: true}}
                                            name='fullname'
                                            value={field.fullname}
                                            onChange={handleChange}
                                            autoComplete='off'
                                            error={!!errors.fullname}
                                            helperText={errors.fullname ? errors.fullname : null }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            variant='outlined'
                                            label='Email'
                                            placeholder='Masukkan email'
                                            InputLabelProps={{shrink: true}}
                                            name='email'
                                            value={field.email}
                                            onChange={handleChange}
                                            autoComplete='off'
                                            error={!!errors.email}
                                            helperText={errors.email ? errors.email : null }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            variant='outlined'
                                            label='Phone'
                                            placeholder='Masukkan nomor handphone'
                                            InputLabelProps={{shrink: true}}
                                            name='phone'
                                            value={field.phone}
                                            onChange={handleChange}
                                            autoComplete='off'
                                            error={!!errors.phone}
                                            helperText={errors.phone ? errors.phone : null }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant='outlined' error={!!errors.levelid}>
                                        <InputLabel htmlFor='levelid'>Level</InputLabel>
                                        <Select
                                            label='Level'
                                            labelId='levelid'
                                            name='levelid'
                                            value={field.levelid}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value='00'><em>--pilih level pengguna--</em></MenuItem>
                                            { levels.map(level => <MenuItem key={level.levelid} value={level.levelid}>
                                                { level.description }
                                            </MenuItem>)}
                                        </Select>
                                        { errors.levelid && <FormHelperText>{errors.levelid}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <Button style={{width: 130}} variant='contained' type='submit' color='primary'>Tambah</Button>
                            </div>
                        </form>
                    </Container>
                </animated.div>
            })}
        </React.Fragment>
    )
}

AddUser.propTypes = {
    levels: PropTypes.array.isRequired,
    session: PropTypes.object.isRequired,
    region: PropTypes.array.isRequired,
    setMessage: PropTypes.func.isRequired,
    addData: PropTypes.func.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
}

function mapStateToProps(state){
    return{
        levels: state.levels,
        session: state.auth,
        region: state.region
    }
}

export default connect(mapStateToProps, { setMessage, addData, setLoadingProgress })(AddUser);