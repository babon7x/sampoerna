import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import { Button, Card, CardHeader, Divider, Grid, List, ListItemText, makeStyles } from '@material-ui/core';
import { animated, useSpringRef, useTransition } from 'react-spring';
import { ListItem } from '@material-ui/core';
import { decimalNumber } from '../../../../utils';
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
    const { sender, receiver, kiriman } = props;
    const classes = useStyles();
    const transRef = useSpringRef();
    const transitions = useTransition(null, {
        ref: transRef,
        keys: null,
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    })

    useEffect(() => {
        transRef.start();
        //eslint-disable-next-line
    }, []);


    return transitions(style => <animated.div style={{ ...style }}>
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <CardItems data={sender} title='Data Pengirim' />
            </Grid>
            <Grid item xs={4}>
                <CardItems data={receiver} title='Data Penerima' />
            </Grid>
            <Grid item xs={4}>
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
                            <ListItemText primary="Produk" secondary={`(${kiriman.fee.serviceCode}) ${kiriman.fee.serviceName} - Rp. ${decimalNumber(kiriman.fee.totalFee)}`} />
                        </ListItem>
                        <ListItem dense>
                            <ListItemText primary="Pickup?" secondary='Tidak' />
                        </ListItem>
                    </List>
                </Card>
            </Grid>
        </Grid>
        <div className={classes.footer}>
            <Button onClick={props.goBack} variant='contained' color='secondary'>Kembali</Button>
            <Button onClick={props.goBack} variant='contained'>Selesai</Button>
        </div>
    </animated.div>)
}

LastStep.propTypes = {
    goBack: PropTypes.func.isRequired,
    sender: PropTypes.object.isRequired,
    receiver: PropTypes.object.isRequired,
    kiriman: PropTypes.object.isRequired,
    fee: PropTypes.object.isRequired,
}

export default LastStep;