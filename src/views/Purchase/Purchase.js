import { Typography } from '@material-ui/core';
import { Stepper, StepLabel, Step, withStyles, StepConnector, Container, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { StepperIcon } from '../../components';
import { StepOne, StepTwo, StepThree, StepFour } from './components';
import PropTypes from 'prop-types'
import { setMessage } from '../../actions/notification';
import { setLoadingProgress } from '../../actions/loadingprogress';
import api from '../../services/api';

function getSteps() {
    return [
        {name: 'Cari Mitra', icon: 'search'},
        {name: 'Nomor PO', icon: 'edit'},
        {name: 'Line PO', icon: 'account_balance_wallet'},
        {name: 'Result', icon: 'check'},
    ]
}
  
// function getStepContent(step) {
//     switch (step) {
//         case 0:
//             return 'Select campaign settings...';
//         case 1:
//             return 'What is an ad group anyways?';
//         case 2:
//             return 'This is the bit I really care about!';
//         default:
//             return 'Unknown step';
//     }
// }


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

const Purchase = props => {
    const { session } = props;
    const [activeStep, setActiveStep] = useState(0);
    const [stepOneValues, setstepOneValues] = useState({});
    const [stepTwoValues, setStepTwoValues] = useState({});
    const [stepThreeValues, setStepThreeValues] = useState({});
    const [loading, setLoading] = useState(false);

    const steps = getSteps();

    const submitStep = (nextstep, parameter) => {
        setActiveStep(nextstep);
        if(nextstep === 1){
            setstepOneValues(parameter);
        }

        if(nextstep === 2){
            setStepTwoValues(parameter);
        }

        if(nextstep === 3){
            setStepThreeValues(parameter);
        }
    }

    const handleBack = () => setActiveStep(activeStep - 1);

    const handleSubmit = async (field) => {
        const payload = {
            ...field,
            token: session.token,
            userid: session.userid
        }

        setLoading(true);
        props.setLoadingProgress(10);

        try {
            const send = await api.purchase.post(payload);
            if(send.rscode === 200){
                props.setMessage({ text: send.message }, true, 'success');
                resetState();
            }else{
                props.setMessage(send, true, 'error');
            }
        } catch (error) {
            props.setLoadingProgress(100);
            props.setMessage(error, true, 'error');
        }

        setLoading(false);
    }

    const resetState = () => {
        setActiveStep(0);
        setstepOneValues({});
        setStepTwoValues({});
        setStepThreeValues({});
    }

    return(
        <Container>
            <div style={{padding: 10, marginTop: 20}}>
                <Typography variant='h6' style={{textAlign: 'center', margin: 15}}>
                    Purchase Order <br/>
                    <Typography variant='body2'>Mohon isi form purchase order dibawah ini dengan benar</Typography>
                </Typography>
                <Stepper style={{backgroundColor: 'transparent'}} alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                    {steps.map((step) => (
                        <Step key={step.name}>
                            <StepLabel icon={step.icon} StepIconComponent={StepperIcon}>{step.name}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                
                <Grid container spacing={2} justify='center'>
                    <Grid item xs={12} sm={12} md={10}>
                        { activeStep === 0 && 
                            <StepOne 
                                onSubmit={submitStep} 
                                usersession={props.session} 
                                setMessage={props.setMessage} 
                                defaultValues={stepOneValues}
                            /> }
                        { activeStep === 1 && 
                            <StepTwo 
                                onSubmit={submitStep} 
                                onGoback={handleBack} 
                                defaultValues={stepTwoValues}
                            /> }
                        { activeStep === 2 && 
                            <StepThree 
                                onSubmit={submitStep} 
                                onGoback={handleBack} 
                                defaultValues={stepThreeValues}
                            /> }
                        
                        { activeStep === 3 && 
                            <StepFour 
                                onSubmit={submitStep} 
                                onGoback={handleBack} 
                                stepOneData={stepOneValues}
                                stepTwoData={stepTwoValues}
                                stepThreeData={stepThreeValues}
                                onDone={handleSubmit}
                                loading={loading}
                            /> }
                    </Grid>
                </Grid>
            </div>
        </Container>
    )
}

Purchase.propTypes = {
    session: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
}

function mapStateToProps(state){
    return {
        session: state.auth
    }
}

export default connect(mapStateToProps, { setMessage, setLoadingProgress })(Purchase);