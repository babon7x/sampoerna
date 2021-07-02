import { animated, useSpringRef, useTransition } from 'react-spring';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, Grid, InputAdornment, InputLabel, makeStyles, Select, TextField } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types'
import { MenuItem } from '@material-ui/core';
import { decimalNumber } from '../../../../utils';

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
    }
}))

const StepFour = props => {
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
        jenis: '1',
        isikiriman: '',
        berat: 0,
        panjang: 0,
        lebar: 0,
        tinggi: 0,
        nilai: ''
    })
    const [errors, setErrors] = useState({});

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(Object.keys(props.defaultValue).length > 0){
            setField(props.defaultValue);
        }
    }, [props.defaultValue]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(field);
        setErrors(errors);

        if(Object.keys(errors).length === 0){
            props.onSubmit(4, field);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'nilai'){
            var val 	= value.replace(/\D/g, '');
            var toInt 	= Number(val);
            setField(prev => ({
                ...prev,
                [name]: decimalNumber(toInt)
            }))
        }else{
            setField(prev => ({ ...prev, [name]: value }));
        
            //reset isi kiriman if kiriman surat
            if(name === 'jenis' && value === '0' && field.isikiriman){
                setField(prev => ({ ...prev, isikiriman: ''}))
            }
        }

        setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    const validate = (values) => {
        const errors = {};
        if(values.jenis === '1' && !values.isikiriman) errors.isikiriman = "Isikirman harus diisi";
        if(values.jenis === '1'){
            if(values.berat){
                if(Number(values.berat) < 1000) errors.berat = "Berat minimal 1000";
            }else{
                errors.berat = "Berat minimal 1000"
            }
        }
        return errors;
    }

    return (
        <form onSubmit={handleSubmit}>
            {transitions(style => <animated.div style={{ ...style }}>
                <Grid container spacing={2} justify='center'>
                    <Grid item xs={12} sm={8}>
                        <Typography align='center' variant='h6'>Kiriman</Typography>
                        <Typography align='center' variant='body2'>Lengkapi deskripsi kiriman</Typography>
                        <div className={classes.content}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={field.jenis === '1' ? 4 : 12}>
                                    <FormControl fullWidth variant='outlined'>
                                        <InputLabel htmlFor='jenis'>Jenis Kiriman *</InputLabel>
                                        <Select
                                            value={field.jenis}
                                            label='Jenis Kiriman *'
                                            labelId='jenis'
                                            name='jenis'
                                            onChange={handleChange}
                                        >
                                            <MenuItem value='1'>Paket</MenuItem>
                                            <MenuItem value='0'>Surat</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                { field.jenis === '1' && <Grid item xs={12} sm={8}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Isi kiriman *'
                                            variant='outlined'
                                            placeholder='Masukkan isi kiriman'
                                            InputLabelProps={{shrink: true}}
                                            value={field.isikiriman}
                                            name='isikiriman'
                                            onChange={handleChange}
                                            error={!!errors.isikiriman}
                                            helperText={errors.isikiriman ? errors.isikiriman : null }
                                        />
                                    </FormControl>
                                </Grid> }          
                                <Grid item xs={6} sm={3}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Berat *'
                                            variant='outlined'
                                            placeholder='Berat kiriman'
                                            InputLabelProps={{shrink: true}}
                                            value={field.berat}
                                            name='berat'
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>Gram</InputAdornment>
                                            }}
                                            type='number'
                                            autoComplete='off'
                                            error={!!errors.berat}
                                            helperText={errors.berat ? errors.berat : null }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Panjang'
                                            variant='outlined'
                                            placeholder='Panjang kiriman'
                                            InputLabelProps={{shrink: true}}
                                            value={field.panjang}
                                            name='panjang'
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>Cm</InputAdornment>
                                            }}
                                            type='number'
                                        />
                                    </FormControl>
                                </Grid>           
                                <Grid item xs={6} sm={3}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Lebar'
                                            variant='outlined'
                                            placeholder='Lebar kiriman'
                                            InputLabelProps={{shrink: true}}
                                            value={field.lebar}
                                            name='lebar'
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>Cm</InputAdornment>
                                            }}
                                            type='number'
                                        />
                                    </FormControl>
                                </Grid>                      
                                <Grid item xs={6} sm={3}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Tinggi'
                                            variant='outlined'
                                            placeholder='Tinggi kiriman'
                                            InputLabelProps={{shrink: true}}
                                            value={field.tinggi}
                                            name='tinggi'
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>Cm</InputAdornment>
                                            }}
                                            type='number'
                                        />
                                    </FormControl>
                                </Grid>                      
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <TextField 
                                            label='Nilai barang'
                                            variant='outlined'
                                            placeholder='Masukkan nilai barang'
                                            InputLabelProps={{shrink: true}}
                                            value={field.nilai}
                                            name='nilai'
                                            onChange={handleChange}
                                            autoComplete='off'
                                        />
                                    </FormControl>
                                </Grid>                      
                            </Grid>
                        </div>
                        <div className={classes.footer}>
                            <Button onClick={props.goBack} color='secondary' variant='contained'>BACK</Button>
                            <Button type='submit' variant='contained'>NEXT</Button>
                        </div>
                    </Grid>
                </Grid>
            </animated.div>)}
        </form>
    ) 

}

StepFour.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    defaultValue: PropTypes.object.isRequired,
}

export default StepFour;