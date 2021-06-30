import React from 'react';
import { makeStyles, TextField, withStyles, Button } from '@material-ui/core';
import PropTypes from 'prop-types'
import { FormHelperText } from '@material-ui/core';

const CustomInput = withStyles((theme) => ({
    root:{
        '& .MuiOutlinedInput-root': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0'
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: '#e0e0e0'
        }
    }
}))(TextField)

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%'
    },
    button: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    }
}))

const InputButton = props => {
    const { value, onChange } = props;
    const classes = useStyles();
 
    return(
        <React.Fragment>
            <div className={classes.root}>
                <CustomInput 
                    variant='outlined'
                    label={props.label ? props.label : 'Search'}
                    size='small'
                    InputLabelProps={{shrink: true}}
                    placeholder={ props.placeholder ? props.placeholder : 'Cari disini..'}
                    fullWidth
                    value={value}
                    onChange={onChange}
                    name='search'
                    autoComplete='off'
                    error={props.isError}
                />
                <Button type='submit' variant='contained' className={classes.button}>
                    { props.buttonlable ? props.buttonlable : 'Filter'}
                </Button>
            </div>
            { props.isError && <FormHelperText error>{props.messageErr}</FormHelperText>}
        </React.Fragment>
    )
}

InputButton.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    buttonlable: PropTypes.string,
    isError: PropTypes.bool,
    messageErr: PropTypes.string,
}

export default InputButton;