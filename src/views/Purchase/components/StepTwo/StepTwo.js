import React, { useEffect, useState } from 'react';
import { Button, Grid, makeStyles, FormControl, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSpringRef, useTransition, animated } from 'react-spring';
import { DatePicker } from '@material-ui/pickers/DatePicker/DatePicker';

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& > *': {
            margin: theme.spacing(0.5)
        },
        marginTop: theme.spacing(2),
        marginRight: -3
    }
}))

const StepTwo = props => {
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
        ponumber: '',
        picname: '',
        vendorname: '',
        startdate: new Date(),
        enddate: new Date()
    })
    const [errors, setErrors] = useState({});

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(props.defaultValues.ponumber){
            const { ponumber, picname, vendorname, startdate, enddate } = props.defaultValues
            setField(prev => ({
                ...prev,
                ponumber,
                picname,
                vendorname,
                startdate,
                enddate
            }))
        }
    }, [props.defaultValues])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setField(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(field);
        setErrors(errors);
        if(Object.keys(errors).length === 0){
            props.onSubmit(2, field);
        }
    }

    const validate = (values) => {
        const errors = {};
        if(!values.ponumber) errors.ponumber = "PO number harus diisi";
        if(!values.picname) errors.picname = "PIC name belum diisi";
        if(!values.vendorname) errors.vendorname = "Nama perusahaan harus diisi";
        return errors;
    }

    const handleChangeDate = (value, name) => setField(prevState => ({
        ...prevState,
        [name]: value
    }))

    return(
        <React.Fragment>
            { transitions(style => <animated.div style={{ ...style }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TextField 
                                    label='Nomor PO'
                                    placeholder='Masukan nomor purchase order'
                                    variant='outlined'
                                    InputLabelProps={{shrink: true}}
                                    value={field.ponumber}
                                    name='ponumber'
                                    autoComplete='off'
                                    onChange={handleChange}
                                    error={!!errors.ponumber}
                                    helperText={errors.ponumber ? errors.ponumber : null }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TextField 
                                    label='PIC'
                                    placeholder='Masukkan nama PIC'
                                    variant='outlined'
                                    InputLabelProps={{shrink: true}}
                                    value={field.picname}
                                    name='picname'
                                    autoComplete='off'
                                    onChange={handleChange}
                                    error={!!errors.picname}
                                    helperText={errors.picname ? errors.picname : null }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                                <TextField 
                                    label='Perusahaan'
                                    placeholder='Masukkan nama perusahaan'
                                    variant='outlined'
                                    InputLabelProps={{shrink: true}}
                                    value={field.vendorname}
                                    name='vendorname'
                                    autoComplete='off'
                                    onChange={handleChange}
                                    error={!!errors.vendorname}
                                    helperText={errors.vendorname ? errors.vendorname : null }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    views={["year", "month", "date"]}
                                    autoOk
                                    variant="inline"
                                    label="Mulai"
                                    inputVariant='outlined'
                                    value={field.startdate}
                                    onChange={(e) => handleChangeDate(e._d, 'startdate')}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    views={["year", "month", "date"]}
                                    autoOk
                                    variant="inline"
                                    label="Sampai"
                                    inputVariant='outlined'
                                    value={field.enddate}
                                    onChange={(e) => handleChangeDate(e._d, 'enddate')}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <div className={classes.footer}>
                        <Button variant='contained' color='secondary' onClick={props.onGoback}>
                            KEMBALI
                        </Button>
                        <Button variant='contained' type='submit'>SELANJUTNYA</Button>
                    </div>
                </form>
            </animated.div>) }
        </React.Fragment>
    )
}

StepTwo.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onGoback: PropTypes.func.isRequired,
    defaultValues: PropTypes.object.isRequired,
}

export default StepTwo;