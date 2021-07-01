import { animated, useSpringRef, useTransition } from 'react-spring';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormControlLabel, Grid, makeStyles, TextField } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { StyledCheckBox } from '../../../../components';
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

const StepTwo = props => {
    const { stepOneData, user, defaultValue } = props;
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
        onbehalf: false,
        usepoemail: false,
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
    //const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        //this work only when not checked both off behafl and use po email
        if(Object.keys(defaultValue).length > 0){
            setField(defaultValue);
            if(!defaultValue.onbehalf){
                //add default value autocomplete
                setOptions([{
                    posCode: defaultValue.kodepos, 
                    address: `${defaultValue.kelurahan} ${defaultValue.kecamatan}`,
                    city: defaultValue.city,
                    category: defaultValue.city,
                    label: defaultValue.label
                }])
            }
        }
    }, [defaultValue]);

    useEffect(() => {
        if(field.usepoemail && stepOneData.email){
            setField(prev => ({ ...prev, email: stepOneData.email }));
            setErrors({});
        }
    }, [field.usepoemail, stepOneData]);

    useEffect(() => {
        if(field.onbehalf && user.fullname){
            const { details, fullname, phone } = user;
            setField(prev => ({ 
                ...prev, 
                fullname,
                phone,
                city: details.city,
                kodepos: details.kodepos,
                kecamatan: details.kecamatan,
                provinsi: details.provinsi,
                kelurahan: details.kelurahan,
                detail: details.address
            }));

            setErrors({});
        }
    }, [user, field.onbehalf])

    useEffect(() => {
        if(field.addressInputValue.length && !field.onbehalf){ //run when custom input
            if(field.addressInputValue.length > 3 && field.addressInputValue.length < 10){ //remove warning default value after back
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
    }, [field.addressInputValue, field.onbehalf]);

    const handleChangeCheckbox = (e) => {
        const { name, checked } = e.target;
        setField(prev => ({ ...prev, [name]: checked }));

        if(name === 'usepoemail' && !checked){
            setField(prev => ({ ...prev, email: '' }));
        }else if(name === 'onbehalf' && !checked){
            setField(prev => ({ 
                ...prev, 
                fullname: '',
                phone: '',
                city: '',
                kodepos: '',
                kecamatan: '',
                provinsi: '',
                kelurahan: '',
                detail: ''
            }));
        }
        
    }

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
        //e.preventDefault();
        //props.onSubmit(2);
        const errors = validate(field);
        
        setErrors(errors);

        if(Object.keys(errors).length === 0){
            props.onSubmit(2, field);
        }
        
    }

    const validate = (values) => {
        const errors = {};
        if(!values.email) errors.email = "Email harus diisi";
        if(!values.phone) errors.phone = "Nomor handphone harus diisi";
        if(!values.fullname) errors.fullname = "Nama harus diisi";
        if(!values.detail) errors.detail = "Detail alamat belum diisi";
        if(!values.provinsi) errors.provinsi = "Provinsi belum diisi";
        if(!values.kecamatan && values.onbehalf) errors.kecamatan = "Kecamatan belum diisi";
        if(!values.city && values.onbehalf) errors.city = "Kota belum diisi";
        if(!values.kodepos && values.onbehalf) errors.kodepos = "Kodepos belum diisi";
        if(!values.onbehalf){
            if(!values.kecamatan || !values.kodepos || !values.city) errors.autocomplete = "Alamat tidak valid";
        }
        return errors;
    }

    return transitions(style => <animated.div style={{ ...style }}>
        <Grid container spacing={2} justify='center'>
            <Grid item xs={12} sm={12} md={8}>
                <Typography align='center' variant='h6'>Pengirim</Typography>
                <Typography align='center' variant='body2'>Kelola data pengirim</Typography>
                <div className={classes.content}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <div className={classes.checkbox}>
                            <FormControlLabel 
                                control={<StyledCheckBox checked={field.usepoemail} name='usepoemail' onChange={handleChangeCheckbox} />}
                                label='Gunakan email pembuat PO'
                            />
                            <FormControlLabel 
                                control={<StyledCheckBox checked={field.onbehalf} name='onbehalf' onChange={handleChangeCheckbox} />}
                                label='On Behalf'
                            />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TextField 
                                    variant='outlined'
                                    label='Email *'
                                    placeholder='Masukkan alamat email'
                                    InputLabelProps={{shrink: true}}
                                    value={field.email}
                                    disabled={field.usepoemail}
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
                                    label='Phone *'
                                    placeholder='Masukkan nomor handphone'
                                    InputLabelProps={{shrink: true}}
                                    value={field.phone}
                                    disabled={field.onbehalf}
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
                                    disabled={field.onbehalf}
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
                        { field.onbehalf ? <React.Fragment>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <TextField 
                                        variant='outlined'
                                        label='Kota *'
                                        placeholder='Masukkan nama kota'
                                        InputLabelProps={{shrink: true}}
                                        value={field.city}
                                        name='city'
                                        onChange={handleChange}
                                        error={!!errors.city}
                                        helperText={errors.city ? errors.city : null }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <TextField 
                                        variant='outlined'
                                        label='Kecamatan *'
                                        placeholder='Masukkan nama kecamatan'
                                        InputLabelProps={{shrink: true}}
                                        value={field.kecamatan}
                                        name='kecamatan'
                                        onChange={handleChange}
                                        error={!!errors.kecamatan}
                                        helperText={errors.kecamatan ? errors.kecamatan : null }
                                    />
                                </FormControl>
                            </Grid>                            
                        </React.Fragment> : <Grid item xs={12} sm={8}>
                            <Autocomplete
                                onChange={handleChangeAutoComplete}
                                inputValue={field.addressInputValue}
                                onInputChange={handleChangeInputAutoComplete}
                                options={options}
                                getOptionSelected={(option, value) => option.label === value.label}
                                getOptionLabel={(option) => `${option.city} (${option.address} - ${option.posCode})`}                                
                                loading={loading}
                                defaultValue={options[0]}
                                // open={open}
                                // onOpen={() => setOpen(true)}
                                // onClose={() => setOpen(false)}
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
                        </Grid> }
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

StepTwo.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    stepOneData: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
    defaultValue: PropTypes.object.isRequired,
}

export default StepTwo;