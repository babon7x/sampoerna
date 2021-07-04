import React from 'react';
import PropTypes from 'prop-types'
import { Button, Dialog, DialogActions, Slide } from '@material-ui/core';
import { DialogTitle } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='down' ref={ref} {...props} />;
});


const ModalDetail = props => {
    const { data } = props;
    return(
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth='xs'
            TransitionComponent={Transition}
        >
            <DialogTitle>PO NUMBER ({data.ponumber})</DialogTitle>
            <DialogContent dividers>
                <List disablePadding dense>
                    <ListItem dense>
                        <ListItemText primary='Email' secondary={data.email}/>
                    </ListItem>
                    <ListItem dense>
                        <ListItemText primary='PIC' secondary={data.picname}/>
                    </ListItem>
                    <ListItem dense>
                        <ListItemText primary='Office' secondary={`${data.officeid} - ${data.officename}`}/>
                    </ListItem>
                    <ListItem dense>
                        <ListItemText primary='Vendor' secondary={`${data.vendorname}`}/>
                    </ListItem>
                    <ListItem dense>
                        <ListItemText primary='Dibuat' secondary={`${data.created}`}/>
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>CLOSE</Button>
            </DialogActions>
        </Dialog>
    )
}

ModalDetail.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
}

export default ModalDetail;