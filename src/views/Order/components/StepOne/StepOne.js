import { animated, useSpringRef, useTransition } from 'react-spring';
import React, { useEffect, useState } from 'react';
import { Button, Grid, InputAdornment, InputLabel, makeStyles, Select, TextField } from '@material-ui/core';
import { Typography, FormControl, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types'
import { Icon } from '@material-ui/core';
import api from '../../../../services/api';
import { MenuItem } from '@material-ui/core';
import { decimalNumber } from '../../../../utils';
import { FormHelperText } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    content: {
        '& > *': {
            marginTop: theme.spacing(2)
        },
        marginTop: theme.spacing(2)
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2)
    }
}))

const StepOne = props => {
    const { user } = props;
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
        choosedline: '00',
        linenumberlist: []
    })
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(field.choosedline !== '00'){
            if(!disabled){
                setDisabled(true);
            }
        }
    }, [field.choosedline, disabled]);

    useEffect(() => {
        if(props.defaultValues.ponumber){
            const { ponumber, choosedline, linenumberlist } = props.defaultValues
            setField(prev => ({ ...prev, ponumber, choosedline, linenumberlist }))
            setDisabled(true);
        }
    }, [props.defaultValues]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if(disabled){
            setField(prev => ({ ...prev, linenumberlist: [], choosedline: '00', ponumber: ''}));
            setDisabled(false);
        }else{
            const errors = validate(field);
            setErrors(errors);
            
            if(Object.keys(errors).length === 0){
                //props.onSubmit(1);
                try {
                    const { token, userid, levelid } = user;
                    const find = await api.purchase.get({ 
                        type: 'data',
                        token,
                        userid,
                        levelid,
                        limit: 100,
                        offset: 0,
                        search: field.ponumber
                    });

                    if(find.rscode === 200){
                        const { data } = find;
                        const linenumberlist = [];
                        data.forEach(line => {
                            linenumberlist.push({
                                number: line.linenumber,
                                bsu: line.bsu,
                                description: line.keterangan
                            })
                        })

                        setField(prev => ({ ...prev, linenumberlist }));
                    }else{
                        props.setMessage(find, true, 'error');
                    }
                } catch (error) {
                    props.setMessage(error, true, 'error');
                }
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setField(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    const validate = (values) => {
        const errors = {};
        if(!values.ponumber) errors.ponumber = "PO number belum diisi";
        return errors;
    }

    const handleNext = () => {
        if(field.choosedline === '00'){
            setErrors(prev => ({ ...prev, choosedline: 'Line po belum dipilih'}));
        }else{
            props.onSubmit(1, field);
        }
    }

    return transitions(style => <animated.div style={{ ...style }}>
        <Grid container spacing={2} justify='center'>
            <Grid item xs={12} sm={8} md={6}>
                <Typography style={{textAlign: 'center'}}>
                    Purchase order mana yang akan anda gunakan?
                </Typography>
                <div className={classes.content}>
                    <form onSubmit={handleSearch}>
                        <FormControl fullWidth>
                            <TextField
                                label='Cari Nomor PO'
                                placeholder='Masukkan nomor purchase order'
                                InputLabelProps={{shrink: true}}
                                variant='outlined'
                                value={field.ponumber}
                                name='ponumber'
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: <InputAdornment>
                                        <IconButton type='submit' size='medium'>
                                            <Icon>{ disabled ? 'close' : 'search'}</Icon>
                                        </IconButton>
                                    </InputAdornment>
                                }}
                                autoComplete='off'
                                error={!!errors.ponumber}
                                helperText={errors.ponumber ? errors.ponumber : null }
                                disabled={disabled}
                            />
                        </FormControl>
                    </form>
                    { field.linenumberlist.length > 0 && <React.Fragment>
                        <FormControl fullWidth variant='outlined' error={!!errors.choosedline}>
                            <InputLabel htmlFor='choosedline'>Line number</InputLabel>
                            <Select
                                value={field.choosedline}
                                name='choosedline'
                                label='Line number'
                                labelId='choosedline'
                                onChange={handleChange}
                            >
                                <MenuItem value='00'><em>--pilih line number--</em></MenuItem>
                                { field.linenumberlist.map(line => <MenuItem key={line.number} value={line.number}>
                                   { `Line ke - ${line.number} (Rp ${decimalNumber(line.bsu)}) - ${line.description}` }
                                </MenuItem>)}
                            </Select>
                            { errors.choosedline && <FormHelperText>{errors.choosedline}</FormHelperText>}
                        </FormControl>
                        <div className={classes.footer}>
                            <Button variant='contained' onClick={handleNext}>SELANJUTNYA</Button>
                        </div>
                    </React.Fragment> }
                </div>
            </Grid>
        </Grid>
    </animated.div>)
}

StepOne.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
    defaultValues: PropTypes.object.isRequired,
}

export default StepOne;