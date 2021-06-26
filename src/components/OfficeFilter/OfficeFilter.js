import { InputLabel, MenuItem } from '@material-ui/core';
import { Grid, FormControl, Select } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { InputButton } from '../../components';
import PropTypes from 'prop-types'

const OfficeFilter = props => {
    const { listregion } = props;
    const [field, setField] = useState({
        reg: '00',
        kprk: '00',
        search: ''
    })

    useEffect(() => {
        props.onFilter(field);
        //eslint-disable-next-line
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setField(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onFilter(field);
    }

    return(
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={4}>
                    <FormControl fullWidth variant='outlined' size='small'>
                        <InputLabel id='region'>Region</InputLabel>
                        <Select
                            label='Region'
                            labelId='region'
                            name='reg'
                            value={field.reg}
                            onChange={handleChange}
                        >
                            <MenuItem value='00'>NASIONAL</MenuItem>
                            { listregion.map(region => <MenuItem value={region.id} key={region.id}>
                                { region.wilayah }
                            </MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} md={4}>
                    <FormControl fullWidth variant='outlined' size='small'>
                        <InputLabel id='office'>Kprk</InputLabel>
                        <Select
                            label='Kprk'
                            labelId='office'
                            name='kprk'
                            value={field.kprk}
                            onChange={handleChange}
                        >
                            <MenuItem value='00'>SEMUA KPRK</MenuItem>
                            <MenuItem value='10004'>REG 01</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <InputButton 
                        value={field.search}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </form>
    )
}

OfficeFilter.propTypes = {
    listregion: PropTypes.array.isRequired,
    onFilter: PropTypes.func.isRequired
}

export default OfficeFilter;