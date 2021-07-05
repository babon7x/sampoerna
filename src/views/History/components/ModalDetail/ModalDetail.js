import { Button, DialogActions, DialogTitle, ListItemText, Slide } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import { Dialog } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types'
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { capitalize, decimalNumber } from '../../../../utils';

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
            TransitionComponent={Transition}
            maxWidth='sm'
        >
            <DialogTitle>DETAIL ORDER</DialogTitle>
            <DialogContent dividers>
                <List disablePadding dense>
                    <ListItem dense>
                        <ListItemText primary='Ext ID' secondary={`${data.extid} dengan PO (${data.ponumber} LINE ${data.linenumber}) `} />
                    </ListItem>
                    <ListItem dense>
                        <ListItemText 
                            primary='Isi Kiriman' 
                            secondary={`${data.isikiriman} (${data.jeniskiriman === '1' ? 'Paket' : 'Surat'})`} 
                        />
                    </ListItem>
                    <ListItem dense>
                        <ListItemText 
                            primary='Produk' 
                            secondary={<React.Fragment>
                                {`${data.productid} - ${data.productname} ` } 
                                ({ data.status !== 0 ? 
                                    data.totalfeereal === null ? `Rp. ${decimalNumber(data.totalfee)}` 
                                        : `dari Rp. ${decimalNumber(data.totalfee)} naik Rp. ${decimalNumber(data.totalfeereal)}` 
                                            : `Rp. ${decimalNumber(data.totalfee)}`})
                            </React.Fragment>}
                            //secondary={`${data.productid} - ${data.productname} (Rp. ${decimalNumber(data.totalfee)})`} 
                        />
                    </ListItem>
                    <ListItem dense>
                        <ListItemText 
                            primary='Order Date' 
                            secondary={`${data.created_at}`} 
                        />
                    </ListItem>
                    <ListItem dense>
                        <ListItemText 
                            primary='Pengirim' 
                            secondary={`${capitalize(data.sendername)} (${capitalize(data.sendercity)}, ${capitalize(data.senderkec)}, ${capitalize(data.senderkel)} - ${data.senderposcode})`} 
                        />
                    </ListItem>
                    <ListItem dense>
                        <ListItemText 
                            primary='Penerima' 
                            secondary={`${capitalize(data.receivername)} (${capitalize(data.receivercity)}, ${capitalize(data.receiverkec)}, ${capitalize(data.receiverkel)} - ${data.receiverposcode})`} 
                        />
                    </ListItem>
                    { data.status === 1 && <React.Fragment>
                        <ListItem dense>
                            <ListItemText 
                                primary='Pickup Location' 
                                secondary={`${capitalize(data.provinci)} (${capitalize(data.city)}, ${capitalize(data.kec)}, ${capitalize(data.kel)} - ${data.poscode})`} 
                            />
                        </ListItem>
                        <ListItem dense>
                            <ListItemText 
                                primary='Pickup Date' 
                                secondary={`${data.pickupdate}`} 
                            />
                        </ListItem>
                    </React.Fragment> }
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