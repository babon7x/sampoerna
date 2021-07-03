import React from 'react';
import PropTypes from 'prop-types'
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Slide
} from '@material-ui/core';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmModal = props => {
    const { open, handleClose, onAggre } = props;

    return(
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth={props.size ? props.size : 'xs'}
        >
            <DialogTitle style={{textAlign: 'center'}}>{props.title ? props.title : 'NOTIFIKASI'}</DialogTitle>
            <DialogContent dividers>
                { props.children }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Batal
                </Button>
                { !props.dontShowYesButton  && <Button onClick={onAggre} color="primary">
                    Ya
                </Button> }
            </DialogActions>
        </Dialog>
    )
}

ConfirmModal.propTypes = {
    children: PropTypes.node,
    open: PropTypes.func.isRequired,
    onAggre: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    size: PropTypes.string,
    title: PropTypes.string,
    dontShowYesButton: PropTypes.bool,
}

export default ConfirmModal;