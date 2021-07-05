import { Backdrop, Button, CircularProgress, Container, Divider, FormControl, Grid, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { DatePicker } from '@material-ui/pickers/DatePicker/DatePicker';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { setMessage } from '../../actions/notification';
import { setLoadingProgress } from '../../actions/loadingprogress';
import PropTypes from 'prop-types'
import api from '../../services/api';
import { convertDate } from '../../utils';
import { ListDataGenerate, MessageSuccess } from './components';

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
    }
}))

const GenerateInvoice = props => {
    const { session } = props;
    const classes = useStyles();
    const [loading, setloading] = useState(false);
    const [field, setField] = useState({
        startdate: new Date(),
        enddate: new Date()
    })
    const [listgenerate, setlistgenerate] = useState([])
    const [success, setsuccess] = useState({
        open: false,
        message: '',
        id: ''
    })
    const [loadingPrint, setloadingPrint] = useState(false);

    const handleChangeDate = (value, name) => setField(prev => ({ ...prev, [name]: value }));

    const handleSearch = async () => {
        if(listgenerate.length > 0){
            setlistgenerate([]);
        }else{
            setloading(true);
            props.setLoadingProgress(10);
            setsuccess(prev => ({ ...prev, open: false }));

            try {
                setTimeout(() => {
                    props.setLoadingProgress(25);
                }, 50);

                const payload = {
                    token: session.token,
                    userid: session.userid,
                    startdate: convertDate(field.startdate, 'yyyymmdd'),
                    enddate: convertDate(field.enddate, 'yyyymmdd')
                }

                const search = await api.invoice.getgenerate(payload);
                if(search.rscode === 200){
                    const data = [];
                    search.data.forEach(element => {
                        data.push({
                            ...element,
                            checked: true
                        })
                    });

                    setlistgenerate(data);
                }else{
                    props.setMessage(search, true, 'error')
                }
            } catch (error) {
                props.setMessage(error, true, 'error')
                setLoadingProgress(100);
            }
            
            setloading(false);
        }
    }

    const handleChangeCheck = (checked, index) => {
        const newItems = [...listgenerate];
        newItems[index]['checked'] = checked;

        setlistgenerate(newItems);
    }

    const handleGenerate = async () => {
        const choosedItems = listgenerate.filter(row => row.checked === true);
        if(choosedItems.length > 0){
            const values = [];
            choosedItems.forEach(element => {
                values.push(element.id);
            });

            props.setLoadingProgress(10);
            setloading(true);
            try {
                setTimeout(() => {
                    props.setLoadingProgress(25);
                }, 50);
                
                const payload = {
                    token: session.token,
                    userid: session.userid,
                    values,
                    startdate: convertDate(field.startdate, 'yyyymmdd'),
                    enddate: convertDate(field.enddate, 'yyyymmdd')
                }

                const generate = await api.invoice.generate(payload);  
                if(generate.rscode === 200){
                    setsuccess({
                        open: true, 
                        message: generate.message,
                        id: generate.id
                    });
                    setlistgenerate([]);
                }else{
                    props.setMessage(generate, true, 'error')
                }
            } catch (error) {
                setLoadingProgress(100);
                props.setMessage(error, true, 'error')
            }
            setloading(false);
        }else{
            props.setMessage({ text: 'Harap centang salah satu terlebih dahulu'}, true, 'error');
        }
    }

    const handlePrint = async () => {
        setloadingPrint(true);
        try {
            const payload = {
                token: session.token, 
                userid: session.userid,
                invoiceid: success.id
            }

            const print = await api.invoice.pdf(payload);
            let blob = new Blob([print], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(blob);
            window.open(url); 

        } catch (error) {
            props.setMessage({ text: 'Terdapat kesalahan, silahkan cobalagi'}, true, 'error')
        }

        setloadingPrint(false);
    }

    return(
        <Container>
            <Backdrop className={classes.backdrop} open={loadingPrint}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={2} justify='flex-end' alignItems='center' className={classes.searchform}>
                <Grid item xs={12} sm={4}>
                    <Typography variant='h6'>GENERATE INVOICE</Typography>
                    <Typography variant='body2'>Silahkan pilih periode yang akan digenerate</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl fullWidth>
                        <DatePicker
                            format="YYYY-MM-DD"
                            views={["year", "month", "date"]}
                            autoOk
                            variant="inline"
                            label="Mulai"
                            inputVariant='outlined'
                            value={field.startdate}
                            size='small'
                            onChange={(e) => handleChangeDate(e._d, 'startdate')}
                            disabled={listgenerate.length > 0 ? true : false }
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl fullWidth>
                        <DatePicker
                            format="YYYY-MM-DD"
                            views={["year", "month", "date"]}
                            autoOk
                            variant="inline"
                            label="Sampai"
                            inputVariant='outlined'
                            value={field.enddate}
                            size='small'
                            onChange={(e) => handleChangeDate(e._d, 'enddate')}
                            disabled={listgenerate.length > 0 ? true : false }
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button 
                        onClick={handleSearch} 
                        variant='contained' 
                        fullWidth 
                        disabled={loading && listgenerate.length <= 0 ? true : false }
                    >
                        { listgenerate.length > 0 ? 'Reset' : loading ? 'Loading...' : 'tampikan'}
                    </Button>
                </Grid>
            </Grid>
            <Divider />
            { success.open ? 
                <MessageSuccess 
                    message={success.message} 
                    onPrint={handlePrint}
                    handleClose={() => setsuccess(prev => ({ ...prev, open: false }))}
                /> : 
                listgenerate.length > 0 && <div>
                    <ListDataGenerate 
                        list={listgenerate} 
                        onChangeChecked={handleChangeCheck}
                    />
                    <div className={classes.footer}>
                        <Button 
                            variant='contained' 
                            onClick={handleGenerate} 
                            color='secondary'
                            disabled={loading}
                        >
                            GENERATE
                        </Button>
                    </div>
                </div> }
        </Container>
    )
}

GenerateInvoice.propTypes = {
    setLoadingProgress: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return{
        session: state.auth
    }
}

export default connect(mapStateToProps, { setLoadingProgress, setMessage })(GenerateInvoice);