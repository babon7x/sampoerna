import React, { useEffect } from 'react';
import { Card, makeStyles, CardHeader, CardActions, Button, Divider, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSpringRef, useTransition, animated } from 'react-spring';
//import api from '../../../../services/api';
import { convertDate, decimalNumber } from '../../../../utils';

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(0.5)
        }
    },
    root: {
        margin: theme.spacing(2)
    },
    cell: {
        fontSize: '13px', 
        borderWidth: 1, 
        borderColor: '#e8e8e8',
        borderStyle: 'solid'
    },
}))


const StepFour = props => {
    const { stepOneData, stepTwoData, stepThreeData } = props;
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
    }, [])

    const handleSubmit = () => {
        const payload = {
            email: stepOneData.email,
            ponumber: stepTwoData.ponumber,
            picname: stepTwoData.picname,
            vendorname: stepTwoData.vendorname,
            values: stepThreeData.inserted,
            startdate: `${convertDate(stepTwoData.startdate, 'yyyymmdd')}`,
            enddate: `${convertDate(stepTwoData.enddate, 'yyyymmdd')}`
        }

        props.onDone(payload);
    }

    return(
        <React.Fragment>
            { transitions(style => <animated.div style={{ ...style }} className={classes.root}>
                <Card>
                    <CardHeader 
                        title='Result'
                        subheader='Pastikan data sudah susuai lalu klik tombol selesai'
                    />
                    <Divider />
                    <CardContent>
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td width='30%'>Email</td>
                                    <td>: {stepOneData.email}</td>
                                </tr>
                                <tr>
                                    <td>Purchase order number</td>
                                    <td>: {stepTwoData.ponumber}</td>
                                </tr>
                                <tr>
                                    <td>PIC name</td>
                                    <td>: {stepTwoData.picname}</td>
                                </tr>
                                <tr>
                                    <td>Perusahaan</td>
                                    <td>: {stepTwoData.vendorname}</td>
                                </tr>
                                <tr>
                                    <td>Periode</td>
                                    <td>: {convertDate(stepTwoData.startdate, 'yyyymmdd')} Sampai {convertDate(stepTwoData.startdate, 'yyyymmdd')}</td>
                                </tr>
                            </tbody>
                        </table>
                        <Table size='small' style={{marginTop: 10}}>
                            <TableHead style={{backgroundColor: 'rgb(160 160 160)'}}>
                                <TableRow>
                                    <TableCell className={classes.cell}>Line Number</TableCell>
                                    <TableCell className={classes.cell}>Deskripsi</TableCell>
                                    <TableCell className={classes.cell}>Besar Uang</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { stepThreeData.inserted.map(line => <TableRow key={line.linenumber}>
                                    <TableCell className={classes.cell}>Line ke - {line.linenumber}</TableCell>
                                    <TableCell className={classes.cell}>{line.description}</TableCell>
                                    <TableCell className={classes.cell}>Rp. {decimalNumber(line.bsu)}</TableCell>
                                </TableRow>) }
                            </TableBody>
                        </Table>
                    </CardContent>
                    <Divider />
                    <CardActions style={{justifyContent: 'flex-end'}}>
                            <Button variant='contained' color='secondary' onClick={props.onGoback}>
                                KEMBALI
                            </Button>
                            <Button 
                                variant='contained' 
                                onClick={handleSubmit}
                                disabled={props.loading}
                            >
                                { props.loading ? 'Loading...' : 'Selesai' }
                            </Button>
                    </CardActions>
                </Card>
            </animated.div>) }
        </React.Fragment>
    )
}

StepFour.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    defaultValues: PropTypes.object.isRequired,
    onGoback: PropTypes.func.isRequired,
    stepOneData: PropTypes.object.isRequired,
    stepTwoData: PropTypes.object.isRequired,
    stepThreeData: PropTypes.object.isRequired,
    onDone: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default StepFour;