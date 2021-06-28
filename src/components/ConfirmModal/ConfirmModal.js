import React from 'react';
import PropTypes from 'prop-types'
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
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
            maxWidth='xs'
        >
            <DialogTitle style={{textAlign: 'center'}}>NOTIFIKASI</DialogTitle>
            <DialogContent>
                { props.children }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Batal
                </Button>
                <Button onClick={onAggre} color="primary">
                    Ya
                </Button>
            </DialogActions>
        </Dialog>
    )
}

ConfirmModal.propTypes = {
    children: PropTypes.node,
    open: PropTypes.func.isRequired,
    onAggre: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
}

export default ConfirmModal;