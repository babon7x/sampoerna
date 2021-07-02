import React from 'react';
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core';

const StepFive = props => {
    return(
        <div>
            <Button onClick={props.goBack} color='secondary' variant='contained'>BACK</Button>
        </div>
    )
}

StepFive.propTypes = {
    goBack: PropTypes.func.isRequired,
}

export default StepFive;