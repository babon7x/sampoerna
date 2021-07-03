import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Card, CardHeader, Divider, Grid, List, ListItemText, makeStyles } from '@material-ui/core';
import { animated, useSpringRef, useTransition } from 'react-spring';
import { ListItem } from '@material-ui/core';
import { decimalNumber } from '../../../../utils';
import api from '../../../../services/api';
// import { Typography } from '@material-ui/core';

const CardItems = props => {
    const { data } = props;
    return(
        <Card raised style={{height: '100%'}}>
            <CardHeader subheader={props.title}/>
            <Divider />
            <List dense disablePadding>
                <ListItem dense>
                    <ListItemText primary="Fullname" secondary={data.fullname} />
                </ListItem>
                <ListItem dense>
                    <ListItemText primary="Email" secondary={data.email} />
                </ListItem>
                <ListItem dense>
                    <ListItemText primary="Phone" secondary={data.phone} />
                </ListItem>
                <ListItem dense>
                    <ListItemText 
                        primary="Address" 
                        secondary={`${data.provinsi}, ${data.city}, ${data.kecamatan}, ${data.kelurahan} (${data.kodepos})`} 
                    />
                </ListItem>
                <ListItem dense>
                    <ListItemText 
                        primary="Address Detail" 
                        secondary={data.detail}
                    />
                </ListItem>
            </List>
        </Card>
    )
}

CardItems.propTypes = {
    data: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
}

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(0.2)
        },
        marginTop: theme.spacing(3)
    },
    content: {
        margin: theme.spacing(2)
    },
    link: {
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 16
    }
}))

const LastStep = props => {
    const { sender, receiver, kiriman, pickup, ponumber, user } = props;
    const classes = useStyles();
    const transRef = useSpringRef();
    const transitions = useTransition(null, {
        ref: transRef,
        keys: null,
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, []);

    const handleDone = async () => {
        const payload = {
            "token": user.token,
            "userid": user.userid,
            "ponumber": ponumber.ponumber,
            "linenumber": ponumber.choosedline,
            "totalfee": Math.round(kiriman.fee.totalFee),
            "fee": Math.round(kiriman.fee.fee),
            "feeTax": Math.round(kiriman.fee.feeTax),
            "insurance": Math.round(kiriman.fee.insurance),
            "insuranceTax": Math.round(kiriman.fee.insuranceTax),
            "berat": kiriman.berat,
            "lebar": kiriman.lebar,
            "panjang": kiriman.panjang,
            "tinggi": kiriman.tinggi,
            "valuegoods": Number(kiriman.nilai.replace(/\./g,'')),
            "productid": kiriman.fee.serviceCode,
            "productname": kiriman.fee.serviceName,
            "sendername": sender.fullname,
            "senderemail": sender.email,
            //eslint-disable-next-line
            "senderphone": sender.phone.replace(/\-/g,''), 
            "senderprovinci": sender.provinsi,
            "sendercity": sender.city,
            "senderkec": sender.kecamatan,
            "senderkel": sender.kelurahan,
            "senderaddr": sender.detail,
            "senderposcode": sender.kodepos,
            "receivername": receiver.fullname,
            "receiveremail": receiver.email,
            "receiverprovinci": receiver.provinsi,
            "receivercity": receiver.city,
            "receiverkec": receiver.kecamatan,
            "receiverkel": receiver.kelurahan,
            "receiveraddr": receiver.detail,
            "receiverposcode": receiver.kodepos,
            "isikiriman": kiriman.isikiriman,
            "jeniskiriman": kiriman.jenis,
            "receiverphone": receiver.phone,
            "pickupoption": pickup.pickupotions ? '1' : '0',
            "pickupprovinci": pickup.provinsi,
            "pickupcity": pickup.city,
            "pickupkec": pickup.kecamatan,
            "pickupkel": pickup.kelurahan,
            "pickupaddress": pickup.addr,
            "pickuposcode": pickup.kodepos
        }

        setLoading(true);
        props.setLoadingProgress(10);

        try {
            const send = await api.order.post(payload);
            if(send.rscode === 200){
                props.setMessage({ text: send.message }, true, 'success');
                setTimeout(() => {
                    props.reset();
                }, 500);
            }else{
                props.setMessage(send, true, 'error');
            }
        } catch (error) {
            props.setLoadingProgress(100);
            props.setMessage(error, true, 'error');
        }

        setLoading(false);
    }


    return transitions(style => <animated.div style={{ ...style }}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <CardItems data={sender} title='Data Pengirim' />
            </Grid>
            <Grid item xs={12} md={4}>
                <CardItems data={receiver} title='Data Penerima' />
            </Grid>
            <Grid item xs={12} md={4}>
                <Card raised style={{height: '100%'}}>
                    <CardHeader subheader='Data Kiriman'/>
                    <Divider />
                    <List dense disablePadding>
                        <ListItem dense>
                            <ListItemText primary="Kiriman" secondary={`${kiriman.isikiriman} (${kiriman.jenis === '1' ? 'Paket' : 'Surat'})`} />
                        </ListItem>
                        <ListItem dense>
                            <ListItemText primary="Berat" secondary={`${kiriman.berat} gram`} />
                        </ListItem>
                        <ListItem dense>
                            <ListItemText primary="Diametrik" secondary={`P = ${kiriman.panjang}, L = ${kiriman.lebar}, T = ${kiriman.tinggi} cm`} />
                        </ListItem>
                        <ListItem dense>
                            <ListItemText primary="Produk" secondary={`(${kiriman.fee.serviceCode}) ${kiriman.fee.serviceName} - Rp. ${decimalNumber(Math.round(kiriman.fee.totalFee))}`} />
                        </ListItem>
                        <ListItem dense>
                            <ListItemText 
                                primary="Pickup?" 
                                secondary={pickup.pickupotions ? `Ya! di ${pickup.city}, ${pickup.kecamatan}, ${pickup.kelurahan} - ${pickup.kodepos} (${pickup.addr})` : 'Tidak'} 
                            />
                        </ListItem>
                    </List>
                </Card>
            </Grid>
        </Grid>
        <div className={classes.footer}>
            <Button onClick={props.goBack} variant='contained' color='secondary'>Kembali</Button>
            <Button onClick={handleDone} variant='contained' disabled={loading}>
                { loading ? 'Loading...' : 'Selesai' }
            </Button>
        </div>
    </animated.div>)
}

LastStep.propTypes = {
    goBack: PropTypes.func.isRequired,
    sender: PropTypes.object.isRequired,
    receiver: PropTypes.object.isRequired,
    kiriman: PropTypes.object.isRequired,
    pickup: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
    ponumber: PropTypes.object.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
}

export default LastStep;