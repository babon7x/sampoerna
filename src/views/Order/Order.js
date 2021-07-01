import { makeStyles, Step, StepConnector, StepLabel, Stepper, Typography, withStyles } from '@material-ui/core';
import { Container } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { StepperIcon } from '../../components';
import { StepFour, StepOne, StepThree, StepTwo } from './components';
import PropTypes from 'prop-types';
import { setMessage } from '../../actions/notification';
import { setLoadingProgress } from '../../actions/loadingprogress';

function getSteps() {
    return [
        {name: 'Po Number', icon: 'search'},
        {name: 'Pengirim', icon: 'person_pin'},
        {name: 'Penerima', icon: 'person_pin'},
        {name: 'Kiriman', icon: 'archive'},
        {name: 'Pickup Location', icon: 'location_on'},
        {name: 'Result', icon: 'check'},
    ]
}

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);


const useStyles = makeStyles(theme => ({
    title: {
        textAlign: 'center'
    }
}))

const Order = props => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [fieldStepOne, setFieldStepOne] = useState({});
    const [fieldStepTwo, setFieldStepTwo] = useState({});
    const [fieldStepThree, setFieldStepThree] = useState({});

    const steps = getSteps();

    const submitStep = (nextStep, parameter) => {
        setActiveStep(nextStep);
        if(nextStep === 1){
            setFieldStepOne(parameter);   
        }else if(nextStep === 2){
            setFieldStepTwo(parameter);   
        }else if(nextStep === 3){
            setFieldStepThree(parameter);
        }
    }

    const handleBack = () => setActiveStep(prevStep => prevStep - 1); 

    return(
        <Container>
            <div className={classes.title}>
                <Typography variant='h5'>Booking Order</Typography>
                <Typography variant='body2'>Untuk melakukan booking order silahkan isi data dibawah ini dengan benar</Typography>
            </div>
            <Stepper style={{backgroundColor: 'transparent'}} alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((step) => (
                    <Step key={step.name}>
                        <StepLabel icon={step.icon} StepIconComponent={StepperIcon}>{step.name}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            
            { activeStep === 0 && 
                <StepOne 
                    onSubmit={submitStep} 
                    setMessage={props.setMessage}
                    user={props.session}
                    defaultValues={fieldStepOne}
                /> }
            { activeStep === 1 && 
                <StepTwo 
                    onSubmit={submitStep} 
                    goBack={handleBack} 
                    stepOneData={fieldStepOne}
                    user={props.session}
                    setMessage={props.setMessage}
                    defaultValue={fieldStepTwo}
                /> }
            { activeStep === 2 && 
                <StepThree 
                    onSubmit={submitStep} 
                    goBack={handleBack} 
                    setMessage={props.setMessage}
                    defaultValue={fieldStepThree}
                /> }
            { activeStep === 3 && <StepFour onSubmit={submitStep} goBack={handleBack} /> }
            
        </Container>
    )
}

Order.propTypes = {
    session: PropTypes.object.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
}

function mapStateToProps(state){
    return {
        session: state.auth
    }
}

export default connect(mapStateToProps, { setLoadingProgress, setMessage })(Order);