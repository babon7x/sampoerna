import { Button, makeStyles, Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon } from '@material-ui/core';
import { useDownloadMenuStyles } from '@mui-treasury/styles/menu/download';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(0.5)
        }
    },
    button: {
        minWidth: 120,
        borderRadius: 20,
        "&.active": {
            background:'#949393',
        },
    }
}))

const MenuOption = props => {
    const { list } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const downloadMenuClasses = useDownloadMenuStyles();
    const classes = useStyles();

    const handleClick = (event) => {
	    setAnchorEl(event.currentTarget);
    };

    return(
        <React.Fragment>
            <Button
                variant='outlined'
                onClick={handleClick}
                className={classes.button}
                endIcon={<Icon>arrow_drop_down</Icon>}
            >
                { props.title }
            </Button>
            <Menu
		        anchorEl={anchorEl}
		        keepMounted
		        open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                classes={{ paper:downloadMenuClasses.paper }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                getContentAnchorEl={null}
            >
                { list.map((row, index) => 
                    <MenuItem 
                        key={index} 
                        onClick={() => { setAnchorEl(null)}}
                        component={NavLink}
                        to={row.path}
                        activeClassName="Mui-selected" 
                    >
                        <div>
                            <Typography>{row.title}</Typography>
                            <Typography variant='caption'>{row.subtitle}</Typography>
                        </div>
                    </MenuItem>
                )}
            </Menu>
        </React.Fragment>
    )
}

MenuOption.propTypes = {
    list: PropTypes.array.isRequired,
    title: PropTypes.string,
}

const MenuDekstop = props => {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            { props.menus.map(row => 
                <React.Fragment key={row.id}>
                    { row.single ? 
                    <Button 
                        variant='outlined' 
                        className={classes.button} 
                        component={NavLink}
                        to={row.path}
                    >
                     {row.title}
                    </Button> : <MenuOption list={row.path} title={row.title} />}
                </React.Fragment>
            )}
        </div>
    )
}

MenuDekstop.propTypes = {
    menus: PropTypes.array.isRequired,
}

export default MenuDekstop;