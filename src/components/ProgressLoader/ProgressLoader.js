import { LinearProgress, makeStyles, withStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar + 1
  }
}))

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 2
    },
    colorPrimary: {
      backgroundColor: '#212121',
    },
    bar: {
      backgroundColor: 'red',
    },
  }))(LinearProgress);

const ProgressLoader = props => {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <BorderLinearProgress 
                variant="determinate" 
                value={props.percentage} 
            />
        </div>
    )
}

ProgressLoader.propTypes = {
    percentage: PropTypes.number.isRequired
}

export default ProgressLoader;