import { Avatar, Badge, makeStyles, withStyles } from '@material-ui/core';
import React from 'react';

const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
}))(Badge);

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
      justifyContent: 'center',
      marginTop: theme.spacing(1)
    },
    avatar: {
        width: theme.spacing(9),
        height: theme.spacing(9),   
    }
}));

const CustomAvatar = props => {
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <StyledBadge
                overlap="circle"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                variant="dot"
            >
                <Avatar 
                    alt="Remy Sharp" 
                    src={process.env.PUBLIC_URL + '/images/todoroki.jpeg'}
                    className={classes.avatar}
                />
            </StyledBadge>
        </div>
    )
}

export default CustomAvatar;