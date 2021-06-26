import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Button, Fade, Menu, MenuItem } from '@material-ui/core';

const SelectOption = props => {
    const { list } = props;
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
	    setAnchorEl(event.currentTarget);
    };

    return(
        <React.Fragment>
            <Button
                variant='outlined'
                size="small"
                style={{margin: 0, fontSize: 11}}
                endIcon={<ArrowDropDownIcon />}
                onClick={handleClick}
                color={props.color}
            >
                Pilih
            </Button>
            <Menu
                id="simple-menu"
		        anchorEl={anchorEl}
		        keepMounted
		        open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                TransitionComponent={Fade}
            >
                { list.map((row, index) => 
                    <MenuItem 
                        key={index} 
                        onClick={() => {
                            setAnchorEl(null);
                            row.onClick();
                        }}
                    >
                        {row.text}
                    </MenuItem>
                )}
            </Menu>
        </React.Fragment>
    )
}

SelectOption.propTypes = {
    list: PropTypes.array.isRequired,
    color: PropTypes.string
}

export default SelectOption;