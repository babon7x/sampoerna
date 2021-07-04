import React, { useEffect, useState } from 'react';
import { Button, Table, TableRow, TableBody, TableHead, TableCell, makeStyles, FormControl, TextField, Grid, InputAdornment, Icon, DialogContentText } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSpringRef, useTransition, animated } from 'react-spring';
import { decimalNumber } from '../../../../utils';
import { IconButton } from '@material-ui/core';
import { ConfirmModal } from '../../../../components';

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& > *': {
            margin: theme.spacing(0.5)
        },
        marginTop: theme.spacing(2),
        marginRight: -3
    },
    cell: {
        fontSize: '13px', 
        borderWidth: 1, 
        borderColor: '#e8e8e8',
        borderStyle: 'solid'
    },
}))

const StepThree = props => {
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
        linenumber: 1,
        bsu: '',
        description: '',
        inserted: []
    })
    const [errors, setErrors] = useState({}) 
    const [open, setOpen] = useState(false);

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(props.defaultValues.linenumber){
            const { linenumber, inserted } = props.defaultValues;
            setField(prev => ({
                ...prev,
                linenumber,
                inserted
            }))
        }
    }, [props.defaultValues])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'bsu'){
            var val 	= value.replace(/\D/g, '');
            var toInt 	= Number(val);
            setField(prev => ({
                ...prev,
                [name]: decimalNumber(toInt)
            }))
        }else{
            setField(prev => ({ ...prev, [name]: value }));
        }

        setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    const handleAdd = () => {
        const errors = validate(field);
        setErrors(errors);
        if(Object.keys(errors).length === 0){
            const inserted = { 
                bsu: field.bsu.replace(/\./g,''), 
                linenumber: field.linenumber, 
                description: field.description 
            };
            setField(prev => ({
                ...prev,
                linenumber: prev.linenumber + 1,
                inserted: [ inserted, ...prev.inserted ],
                bsu: '',
                description: ''
            }))
        }
    }

    const validate = (values) => {
        const errors = {};
        if(!values.bsu) errors.bsu = "Bsu belum diisi";
        if(!values.description) errors.description = "Keterangan belum diisi";
        return errors;
    }

    const deleteInserted = (linenumber) => {
        const filtered = field.inserted.filter(insert => insert.linenumber !== Number(linenumber));
        setField(prev => ({ ...prev, inserted: filtered }));
    }

    const handleBack = () => {
        if(field.inserted.length > 0 && !props.defaultValues.linenumber){
            setOpen(true);
        }else{
            props.onGoback();
        }
    }

    return(
        <React.Fragment>
            <ConfirmModal open={open} handleClose={() => setOpen(false)} onAggre={props.onGoback}>
                <DialogContentText style={{textAlign: 'center'}}>
                    Apakah anda yakin untuk kembali ke tahap sebelumnya? Catatan: Data yang dinsert akan direset
                </DialogContentText>
            </ConfirmModal>
            { transitions(style => <animated.div style={{ ...style }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField 
                                label='Line PO'
                                placeholder='line purchase order'
                                InputLabelProps={{shrink: true}}
                                variant='outlined'
                                value={`Line ke ${field.linenumber}`}
                                disabled
                                size='small'
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField 
                                label='Besar uang'
                                placeholder='Masukkan besar uang'
                                InputLabelProps={{shrink: true}}
                                variant='outlined'
                                InputProps={{startAdornment: <InputAdornment position='start'>Rp.</InputAdornment>}}
                                size='small'
                                value={field.bsu}
                                name='bsu'
                                onChange={handleChange}
                                autoComplete='off'
                                error={!!errors.bsu}
                                helperText={errors.bsu ? errors.bsu : null }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                            <TextField 
                                label='Deskripsi'
                                placeholder='Deskripsi line po'
                                InputLabelProps={{shrink: true}}
                                variant='outlined'
                                size='small'
                                value={field.description}
                                name='description'
                                onChange={handleChange}
                                autoComplete='off'
                                error={!!errors.description}
                                helperText={errors.description ? errors.description : null }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleAdd} fullWidth variant='contained' color='primary' style={{color: '#FFF'}}>TAMBAH</Button>
                    </Grid>
                    { field.inserted.length > 0  && <Grid item xs={12}>
                        <Table size='small'>
                            <TableHead style={{backgroundColor: 'rgb(160 160 160)'}}>
                                <TableRow>
                                    <TableCell className={classes.cell}>LINE PO</TableCell>
                                    <TableCell className={classes.cell}>DESKRIPSI</TableCell>
                                    <TableCell className={classes.cell}>BSU</TableCell>
                                    <TableCell className={classes.cell} align='center'>HAPUS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { field.inserted.map((insert, i) => <TableRow key={i}>
                                    <TableCell className={classes.cell}>Line ke {insert.linenumber}</TableCell>
                                    <TableCell className={classes.cell}>{insert.description}</TableCell>
                                    <TableCell className={classes.cell}>Rp. {decimalNumber(insert.bsu)}</TableCell>
                                    <TableCell className={classes.cell} align='center'>
                                        <IconButton size='small' onClick={() => deleteInserted(insert.linenumber)}>
                                            <Icon fontSize='small'>delete</Icon>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </Grid>}
                </Grid>
                <div className={classes.footer}>
                    <Button variant='contained' color='secondary' onClick={handleBack}>KEMBALI</Button>
                    { field.inserted.length > 0 && 
                        <Button 
                            variant='contained' 
                            onClick={() => props.onSubmit(3, field)}
                        >
                            SELANJUTNYA
                        </Button> }
                </div>
            </animated.div>) }
        </React.Fragment>
    )
}

StepThree.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onGoback: PropTypes.func.isRequired,
    defaultValues: PropTypes.object.isRequired,
}

export default StepThree;