import { 
    makeStyles,
    List,
    ListItemIcon,
    ListItemText,
    ListItem,
    Icon,
    Button,
    Collapse
} from '@material-ui/core';
import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { CustomAvatar } from '../../../../components';
import { Typography, Divider } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    list: {
        width: 250
    },
    center: {
        marginBottom: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    toolbar: {
        ...theme.mixins.toolbar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold'
    },
    nested: {
        paddingLeft: theme.spacing(4.2),
    },
    titleversion: {
        textAlign: 'center',
        padding: theme.spacing(4)
    }
}))

const SidebarMenu = props => {
    const { list, user } = props;
    const classes = useStyles();

    const [open, setOpen] = useState({})

    const singlemenu = (row, type) => (
        <ListItem 
            key={row.id}
            button 
            component={NavLink} 
            to={row.path} 
            onClick={props.toogleDrawer(false)}
            activeClassName="Mui-selected" 
            exact
            className={ type === 'nested' ? classes.nested : undefined }
        >
            { row.icon !== 'none' && <ListItemIcon style={{minWidth: 36}}>
                <Icon>{row.icon}</Icon>
            </ListItemIcon> }

            <ListItemText 
                primary={row.title} 
                secondary={row.subtitle}
            />
        </ListItem> 
    );

    const multiplemenu = (row) => (
        <div key={row.id}>
            <ListItem 
                button
                onClick={() => handleClickMenu(row.id)}
            >
                <ListItemIcon style={{minWidth: 36}}>
                    <Icon>{row.icon}</Icon>
                </ListItemIcon>
                <ListItemText 
                    primary={row.title} 
                    secondary={row.subtitle}
                />
                { open[row.id] ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon> }
            </ListItem> 
            <Collapse in={open[row.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    { row.path.map(subrow => 
                        { return singlemenu(subrow, 'nested')}
                    )}
                </List>
            </Collapse>
        </div>
    );

    const handleClickMenu = (id) => setOpen(prevState => ({ ...prevState, [id]: !prevState[id]}))


    return(
        <div
            role='presentation'
            //onClick={props.toogleDrawer(false)}
            className={classes.list}
        >
            { user.email ? <React.Fragment>
                <CustomAvatar /> 
                <div className={classes.center}>
                    <Typography>{user.fullname.split(' ').slice(0, -1).join(' ')}</Typography>
                </div>
                <div className={classes.center}>
                    <Button 
                        variant='outlined' 
                        size='small'
                        component={NavLink}
                        to="/profile"
                        onClick={props.toogleDrawer(false)}
                    > 
                        Edit
                    </Button>
                </div>
            </React.Fragment> : <div className={classes.titleversion}>
                <Typography>Untuk memuat menu, kamu harus login terlebih dahulu</Typography>
                <br />
                <Typography variant='caption'>Current version 2.0.1</Typography>
            </div> }

            <Divider />
                
            <List style={{marginTop: -8}}>
                { list.map(row => {
                    if(row.single){
                        return singlemenu(row);
                    }else{
                        return multiplemenu(row);
                    }
                })}
            </List>

        </div>
    )
}

SidebarMenu.propTypes = {
    toogleDrawer: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired
}

export default SidebarMenu;