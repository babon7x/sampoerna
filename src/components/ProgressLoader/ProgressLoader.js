import { LinearProgress, withStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

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