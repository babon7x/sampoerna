import { LinearProgress, withStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 5
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[700],
    },
    bar: {
      backgroundColor: '#FFF',
    },
  }))(LinearProgress);

const ProgressLoader = props => {
    return(
        <div style={{position: 'absolute', top: 0, left: 0, right: 0}}>
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