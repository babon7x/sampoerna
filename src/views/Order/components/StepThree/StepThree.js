import { animated, useSpringRef, useTransition } from 'react-spring';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, Grid, makeStyles, TextField } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import api from '../../../../services/api';

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: theme.spacing(2),
        '& > *': {
            margin: theme.spacing(0.2)
        }
    },
    content: {
        '& > *': {
            padding: theme.spacing(2)
        }
    },
    checkbox: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}))

const StepThree = props => {
    const { defaultValue } = props;
    const classes = useStyles();
    const transRef = useSpringRef();
    const transitions = useTransition(null, {
        ref: transRef,
        keys: null,
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    })

    const [field, setField] = useState({
        email: '',
        fullname: '',
        phone: '',
        addressInputValue: '',
        kecamatan: '',
        kelurahan: '',
        kodepos: '',
        city: '',
        provinsi: '',
        detail: '',
        label: ''
    })
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(Object.keys(defaultValue).length > 0){
            setField(defaultValue);
            //add default value autocomplete
            setOptions([{
                posCode: defaultValue.kodepos, 
                address: `${defaultValue.kelurahan} ${defaultValue.kecamatan}`,
                city: defaultValue.city,
                category: defaultValue.city,
                label: defaultValue.label
            }])
        }
    }, [defaultValue]);

    useEffect(() => {
        if(field.addressInputValue.length){
            if(field.addressInputValue.length > 3 && field.addressInputValue.length < 10){ //remove fetching back after choose
                const timeId = setTimeout(() => {
                    (async () => {
                        setLoading(true);
                        try {
                            const response = await api.order.getAddress({ address: field.addressInputValue });
                            if(response.rscode === 200){
                                setOptions(response.info);   
                            }else{
                                props.setMessage(response, true, 'error');
                            }
                        } catch (error) {
                            props.setMessage(error, true, 'error');
                        }
                        setLoading(false);
                    })();
                }, 500);
    
                return () => clearTimeout(timeId);
            }
        }
        //eslint-disable-next-line
    }, [field.addressInputValue]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setField(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    const handleChangeInputAutoComplete = (event, newValue) => {
        setField(prev => ({ ...prev, addressInputValue: newValue }));
    }

    const handleChangeAutoComplete = (e, newValue) => {
        if(newValue !== null){
            const { address, city, posCode, label } = newValue;
            const addrValues = address.split("Kec.");

            setField(prev => ({ 
                ...prev, 
                city,
                kodepos: posCode,
                kelurahan: addrValues[0].trim(),
                kecamatan: addrValues.length > 1 ? `Kec. ${addrValues[1].trim()}` : '',
                label
            }))
        }else{ //remove value
            setField(prev => ({ ...prev, city: '', kodepos: '', kelurahan: '', kecamatan: '', label: ''}));
        }

        setErrors(prev => ({ ...prev, autocomplete: undefined }));
    }

    const handleNext = () => {
        const errors = validate(field);
        
        setErrors(errors);

        if(Object.keys(errors).length === 0){
            props.onSubmit(3, field);
        }
        
    }

    const validate = (values) => {
        const errors = {};
        if(!values.email) errors.email = "Email harus diisi";
        if(!values.fullname) errors.fullname = "Nama harus diisi";
        if(!values.detail) errors.detail = "Detail alamat belum diisi";
        if(!values.provinsi) errors.provinsi = "Provinsi belum diisi";
        if(!values.kecamatan || !values.kodepos || !values.city) errors.autocomplete = "Alamat tidak valid";
        
        return errors;
    }

    return transitions(style => <animated.div style={{ ...style }}>
        <Grid container spacing={2} justify='center'>
            <Grid item xs={12} sm={12} md={8}>
                <Typography align='center' variant='h6'>Penerima</Typography>
                <Typography align='center' variant='body2'>Kelola data penerima</Typography>
                <div className={classes.content}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TextField 
                                    variant='outlined'
                                    label='Email *'
                                    placeholder='Masukkan alamat email'
                                    InputLabelProps={{shrink: true}}
                                    value={field.email}
                                    name='email'
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email ? errors.email : null }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TextField 
                                    variant='outlined'
                                    label='Phone'
                                    placeholder='Masukkan nomor handphone'
                                    InputLabelProps={{shrink: true}}
                                    value={field.phone}
                                    name='phone'
                                    onChange={handleChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone ? errors.phone : null }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                                <TextField 
                                    variant='outlined'
                                    label='Nama Lengkap *'
                                    placeholder='Masukkan nama lengkap'
                                    InputLabelProps={{shrink: true}}
                                    value={field.fullname}
                                    name='fullname'
                                    onChange={handleChange}
                                    error={!!errors.fullname}
                                    helperText={errors.fullname ? errors.fullname : null }
                                />
                            </FormControl>
                        </Grid>           
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <TextField 
                                    variant='outlined'
                                    label='Provinsi *'
                                    placeholder='Masukkan nama provinsi'
                                    InputLabelProps={{shrink: true}}
                                    value={field.provinsi}
                                    name='provinsi'
                                    onChange={handleChange}
                                    error={!!errors.provinsi}
                                    helperText={errors.provinsi ? errors.provinsi : null }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Autocomplete
                                onChange={handleChangeAutoComplete}
                                inputValue={field.addressInputValue}
                                onInputChange={handleChangeInputAutoComplete}
                                options={options}
                                getOptionSelected={(option, value) => option.label === value.label}
                                getOptionLabel={(option) => `${option.city} (${option.address} - ${option.posCode})`}                                
                                loading={loading}
                                defaultValue={options[0]}
                                renderInput={(params) => 
                                    <TextField 
                                        {...params} 
                                        label="Alamat pengirim *" 
                                        placeholder="Cari kota/kabupaten/kecamatan/kelurahan.."
                                        variant="outlined"
                                        InputLabelProps={{shrink: true}} 
                                        error={!!errors.autocomplete}
                                        helperText={errors.autocomplete ? errors.autocomplete : 'Alamat minimal 3 karakter' }
                                    />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                                <TextField 
                                    variant='outlined'
                                    label='Detail Alamat *'
                                    placeholder='Masukkan detail alamat (jln/no)'
                                    InputLabelProps={{shrink: true}}
                                    value={field.detail}
                                    name='detail'
                                    onChange={handleChange}
                                    multiline
                                    rows={2}
                                    rowsMax={2}
                                    error={!!errors.detail}
                                    helperText={errors.detail ? errors.detail : null }
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.footer}>
                    <Button onClick={props.goBack} color='secondary' variant='contained'>BACK</Button>
                    <Button onClick={handleNext} variant='contained'>NEXT</Button>
                </div>
            </Grid>
        </Grid>
    </animated.div>)
}

StepThree.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    defaultValue: PropTypes.object.isRequired,
}

export default StepThree;