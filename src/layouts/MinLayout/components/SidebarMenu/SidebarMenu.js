import { 
    makeStyles,
    List,
    ListItemIcon,
    ListItemText,
    ListItem,
    Icon,
    Button
} from '@material-ui/core';
import React from 'react';
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
    }
}))

const SidebarMenu = props => {
    const { list, user } = props;
    const classes = useStyles();

    return(
        <div
            role='presentation'
            //onClick={props.toogleDrawer(false)}
            className={classes.list}
        >
            { user.email && <React.Fragment>
                <CustomAvatar /> 
                <div className={classes.center}>
                    <Typography>{user.fullname.split(' ').slice(0, -1).join(' ')}</Typography>
                </div>
                <div className={classes.center}>
                    <Button variant='outlined' size='small'> 
                        Edit
                    </Button>
                </div>
                <Divider />
            </React.Fragment> }

            <List>
                { list.map(menu => 
                    <ListItem 
                        button 
                        key={menu.id}
                        component={NavLink}
                        to={menu.path}
                        exact
                        activeClassName="Mui-selected" 
                        onClick={props.toogleDrawer(false)}
                    >
                        <ListItemIcon>
                            <Icon>{menu.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText 
                            primary={menu.title} 
                            secondary={menu.subtitle}
                        />
                    </ListItem>)}
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