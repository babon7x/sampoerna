import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { setMessage } from '../../actions/notification';
import { getData } from '../../actions/invoice';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { Container, Table, TableCell, TableContainer, TableRow, TableHead, Card, CardActions, TableBody, IconButton, Backdrop, CircularProgress, makeStyles, TextField, Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { decimalNumber } from '../../utils';
import { Divider } from '@material-ui/core';
import { Icon } from '@material-ui/core';
import api from '../../services/api';
import { FormControl } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    searchform: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
    footer: {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'flex-end'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    header: {
        margin: theme.spacing(1),
        width: '100%',
        paddingRight: 10
    },
    form: {
        display: 'flex',
        height: '100%',
        alignItems: 'center'
    }
}))

const Invoice = props => {
    const classes = useStyles();
    const { session, totaldata, listinvoice } = props;
    const [countFetched, setcountFetched] = useState(false);
    const [paging, setpaging] = useState({
        limit: 13,
        activePage: 1
    })
    const [loading, setloading] = useState(false)

    const { limit, activePage } = paging;
    const offsetValue = (activePage * limit) - limit;
    const defaultparams = {
        limit,
        offset: offsetValue,
        token: session.token,
        userid: session.userid,
        type: 'count'
    }

    useEffect(() => {
        fetch(defaultparams, 1);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(countFetched){
            fetch({ ...defaultparams, type: 'data' }, activePage);
        }
        //eslint-disable-next-line
    }, [countFetched]);

    const fetch = async (parameter, page) => {
        if(parameter.type === 'data'){
            props.setLoadingProgress(10);

            setTimeout(() => {
                props.setLoadingProgress(20);
            }, 200);
        }

        try {
            const newParams = {
                ...parameter,
                limit: parameter.type === 'data' ? parameter.limit : undefined,
                offset: parameter.type === 'data' ? parameter.offset : undefined,
            }
            
            await props.getData(newParams, page);
            if(parameter.type === 'count'){
                setcountFetched(true);
            }   
        } catch (error) {
            props.setMessage(error, true, 'error');
            props.setLoadingProgress(100);
        }
    }

    const handleChangePage = (e, page) => {
        setpaging(paging => ({ ...paging, activePage: page }))
        const parameter = {
            ...defaultparams,
            type: 'data',
            offset: (page * limit) - limit, //refresh offset value with change activepage in state
        }

        fetch(parameter, page);
    }

    const handlePrint = async (id) => {
        setloading(true);
        try {
            const payload = {
                token: session.token, 
                userid: session.userid,
                invoiceid: id
            }

            const print = await api.invoice.pdf(payload);
            let blob = new Blob([print], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(blob);
            window.open(url); 

        } catch (error) {
            props.setMessage({ text: 'Terdapat kesalahan, silahkan cobalagi'}, true, 'error')
        }

        setloading(false);
    }

    var pagesrow        = listinvoice[`page_${activePage}`] ? listinvoice[`page_${activePage}`] : [];
    var firstNumber     = (activePage * limit) - limit + 1;

    return(
        <Container>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div style={{marginTop: 10}}>
                <Card>
                    <Grid container spacing={2} justify='space-between' className={classes.header}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant='h6'>Data Invoice</Typography>
                            <Typography variant='body1'>Rekap data hasil generate</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8} md={3}>
                            <div className={classes.form}>
                                <FormControl fullWidth>
                                    <TextField 
                                        variant='outlined'
                                        label='Search'
                                        placeholder='Cari nomor invoice...'
                                        InputLabelProps={{shrink: true}}
                                        // size='small'
                                    />
                                </FormControl>
                            </div>
                        </Grid>
                    </Grid>
                    <Divider />
                    <TableContainer>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>NO</TableCell>
                                    <TableCell>NOMOR INVOICE</TableCell>
                                    <TableCell>TANGGAL</TableCell>
                                    <TableCell align='right'>JUMLAH PO</TableCell>
                                    <TableCell align='right'>HARGA TOTAL</TableCell>
                                    <TableCell align='center'>PRINT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { pagesrow.length <= 0 ? <TableRow>
                                    <TableCell colSpan={6} align='center'>No data available</TableCell>
                                </TableRow> : pagesrow.map(invoice => <TableRow key={invoice.invoicenumber}>
                                    <TableCell>{firstNumber++}</TableCell>
                                    <TableCell>{invoice.invoicenumber}</TableCell>
                                    <TableCell>{invoice.created}</TableCell>
                                    <TableCell align='right'>{invoice.po_used}</TableCell>
                                    <TableCell align='right'>Rp. {decimalNumber(invoice.harga)}</TableCell>
                                    <TableCell align='center'>
                                        <IconButton size='small' onClick={() => handlePrint(invoice.invoicenumber)}>
                                            <Icon fontSize='small'>print</Icon>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <CardActions style={{justifyContent: 'flex-end'}}>
                        <Pagination 
                            count={Math.ceil(totaldata / limit)} 
                            page={activePage}
                            shape='rounded'
                            color='secondary'
                            onChange={handleChangePage}
                        />
                    </CardActions>
                </Card>
            </div>
        </Container>
    )
}

Invoice.propTypes = {
    session: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    totaldata: PropTypes.number.isRequired,
    listinvoice: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        session: state.auth,
        totaldata: state.invoice.total,
        listinvoice: state.invoice.data
    }
}

export default connect(mapStateToProps, { setMessage, setLoadingProgress, getData })(Invoice);