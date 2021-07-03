import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { Button, ButtonGroup, FormControl, FormControlLabel, Grid, Link, makeStyles, TextField } from '@material-ui/core';
import { animated, useSpringRef, useTransition } from 'react-spring';
import { Alert, Autocomplete } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import { decimalNumber } from '../../../../utils';
import { StyledCheckBox } from '../../../../components';
import api from '../../../../services/api';

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
    },
    form: {
        margin: theme.spacing(3)
    },
    alert: {
        display: 'flex',
        justifyContent: 'center'
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
    const [field, setField] = useState({
        pickupotions: false,
        usesenderloc: false,
        provinsi: '',
        city: '',
        kodepos: '',
        kecamatan: '',
        kelurahan:  '',
        addr: '',
        addressInputValue: '',
        label: ''
    });
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(Object.keys(props.defaultValues).length > 0){
            setField(props.defaultValues);
            if(!props.defaultValues.usesenderloc && props.defaultValues.pickupotions){
                setOptions([{
                    posCode: props.defaultValues.kodepos, 
                    address: `${props.defaultValues.kelurahan} ${props.defaultValues.kecamatan}`,
                    city: props.defaultValues.city,
                    category: props.defaultValues.city,
                    label: props.defaultValues.label
                }])
            }
        }
    }, [props.defaultValues])

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

    useEffect(() => {
        if(field.usesenderloc){
            const { provinsi, kodepos, kecamatan, city, kelurahan, detail } = props.sender;
            setField(prev => ({
                ...prev,
                provinsi,
                kodepos,
                kecamatan,
                city,
                kelurahan,
                addr: detail
            }))
        }
    }, [field.usesenderloc, props.sender]);

    const handleSubmit = () => {
        if(field.pickupotions){
            const errors = validate(field);
            setErrors(errors);
            if(Object.keys(errors).length === 0){
                props.onSubmit(5, field);
            }
        }else{
            props.onSubmit(5, field);
        }
    }

    const validate = (values) => {
        const errors = {};
        if(!values.provinsi) errors.provinsi = "Provinsi belum diisi";
        if(!values.usesenderloc){
            if(!values.kelurahan || !values.kecamatan || !values.city || !values.kodepos) errors.autocomplete = "Alamat tidak valid";
        }
        if(!values.addr) errors.addr = "Detail alamat belum diisi";
        return errors;
    }


    const handleChangeCheckbox = (e) => {
        const { name, checked } = e.target;
        setField(prev => ({ ...prev, [name]: checked }));

        if(name === 'usesenderloc' && !checked){
            setField(prev => ({ 
                ...prev,
                provinsi: '',
                kodepos: '',
                kecamatan: '',
                kelurahan:  '',
                addr: '',
                city: '',
                label: '',
                addressInputValue: ''
            }));

            setOptions([]);
        }

        setErrors({});
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

    return transitions(style => <animated.div style={{ ...style }}>
            <Grid container spacing={2} justify='center'>
                <Grid item xs={12} sm={8}>
                    { Object.keys(stepFourData).length > 0 && <div className={classes.alert}>
                        <Alert variant='outlined' severity='success' color='warning'>
                            Produk yang dipilih <strong>({stepFourData.fee.serviceCode}) {stepFourData.fee.serviceName}</strong> - Rp. {decimalNumber(stepFourData.fee.totalFee)}
                            &nbsp;<Link underline='none' onClick={props.goBack} className={classes.link}>ganti produk</Link>
                        </Alert>
                    </div> }

                    { field.pickupotions ? <div className={classes.form}>
                        <Typography align='center' variant='body1' style={{marginBottom: 10}}>Tentukan lokasi pickup</Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControlLabel 
                                    control={<StyledCheckBox checked={field.usesenderloc} name='usesenderloc' onChange={handleChangeCheckbox}/>}
                                    label='Gunakan lokasi pengirim sebagai lokasi pickup'
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <TextField 
                                        label='Provinsi *'
                                        variant='outlined'
                                        InputLabelProps={{shrink: true}}
                                        placeholder='Masukkan provinsi'
                                        value={field.provinsi}
                                        name='provinsi'
                                        onChange={handleChange}
                                        error={!!errors.provinsi}
                                        helperText={errors.provinsi ? errors.provinsi : null }
                                    />
                                </FormControl>
                            </Grid>

                            { field.usesenderloc ? <React.Fragment>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Kota *'
                                            variant='outlined'
                                            InputLabelProps={{shrink: true}}
                                            placeholder='Masukkan kota'
                                            value={field.city}
                                            name='city'
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Kecamatan *'
                                            variant='outlined'
                                            InputLabelProps={{shrink: true}}
                                            placeholder='Masukkan kecamatan'
                                            value={field.kecamatan}
                                            name='kecamatan'
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Kelurahan *'
                                            variant='outlined'
                                            InputLabelProps={{shrink: true}}
                                            placeholder='Masukkan kelurahan'
                                            value={field.kelurahan}
                                            name='kelurahan'
                                            disabled
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Kodepos *'
                                            variant='outlined'
                                            InputLabelProps={{shrink: true}}
                                            placeholder='Masukkan kodepos'
                                            value={field.kodepos}
                                            name='kodepos'
                                            disabled
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
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params} 
                                            label="Alamat *" 
                                            placeholder="Cari kota/kabupaten/kecamatan/kelurahan.."
                                            variant="outlined"
                                            InputLabelProps={{shrink: true}} 
                                            error={!!errors.autocomplete}
                                            helperText={errors.autocomplete ? errors.autocomplete : 'Alamat minimal 3 karakter' }
                                        />}
                                />
                            </Grid>}

                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <TextField 
                                        label='Detail alamat *'
                                        variant='outlined'
                                        InputLabelProps={{shrink: true}}
                                        placeholder='Masukkan detail alamat'
                                        value={field.addr}
                                        name='addr'
                                        multiline
                                        rowsMax={2}
                                        rows={2}
                                        onChange={handleChange}
                                        disabled={field.usesenderloc}
                                        error={!!errors.addr}
                                        helperText={errors.addr ? errors.addr : null }
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <div className={classes.footer} style={{justifyContent: 'flex-end', marginTop: 10}}>
                            <Button 
                                variant='contained' 
                                color='secondary' 
                                style={{marginRight: 5}}
                                onClick={() => setField(prev => ({ ...prev, pickupotions: false }))}
                            >
                                BATAL
                            </Button>
                            <Button variant='contained' onClick={handleSubmit}>NEXT</Button>
                        </div>
                    </div> : <React.Fragment>
                        <div className={classes.content}>
                            <Typography align='center' variant='body1'>Apakah anda ingin mempickup langsung kiriman ini?</Typography>
                        </div>
                        <div className={classes.footer}>
                            <ButtonGroup disableElevation variant="contained" fullWidth style={{maxWidth: '50%'}}>
                                <Button onClick={handleSubmit}>Nanti</Button>
                                <Button onClick={() => setField(prev => ({ ...prev, pickupotions: true }))}>Ya</Button>
                            </ButtonGroup>
                        </div>
                    </React.Fragment>}                    
                </Grid>
            </Grid>
        </animated.div>
    )
}

StepFive.propTypes = {
    goBack: PropTypes.func.isRequired,
    stepFourData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    sender: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
    defaultValues: PropTypes.object.isRequired,
}

export default StepFive;