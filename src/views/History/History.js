import { FormControl, Grid, InputLabel, Select, TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { Container, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { getOrder } from '../../actions/orders';
import { setMessage } from '../../actions/notification';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { ListOrder, ModalDetail } from './components';
import { Pagination } from '@material-ui/lab';
import statusorder from '../../json/statusorder.json';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(1)
    },
    paging: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'center'
    }
}))

const History = props => {
    const classes = useStyles();
    const { session, orderlist, totalorder } = props;

    const [paging, setPaging] = useState({
        limit: 6,
        activePage: 1
    })
    const [countFetched, setCountFetched] = useState(false);
    const [field, setField] = useState({
        status: 'all',
        search: '',
        loadingsearch: false
    })
    const [detail, setDetail] = useState({
        open: false,
        data: {}
    });

    const { limit, activePage } = paging;
    const offsetValue = (activePage * limit) - limit;
    const defaultparams = {
        limit,
        offset: offsetValue,    
        token: session.token,    
        userid: session.userid,
        office: session.details.officeid,
        type: 'count',
        status: field.status,
        search: field.search ? field.search : undefined
    }

    useEffect(() => {
        if(!field.search){
            if(countFetched){
                setCountFetched(false); //remount fetch
            }
            fetch(defaultparams, 1);
        }
        //eslint-disable-next-line
    }, [field.search])

    useEffect(() => {
        if(countFetched){
            fetch({ ...defaultparams, type: 'data' }, activePage);
        }
        //eslint-disable-next-line
    }, [countFetched]);

    useEffect(() => {
        if(field.search){
            if(field.search.length > 3){
                const timeid = setTimeout(() => {
                    (async () => {
                        setField(prev => ({ ...prev, loadingsearch: true }));
                        
                        await props.getOrder({ ...defaultparams, search: field.search }, 1)

                        fetch({ 
                            ...defaultparams, 
                            offset: 0, 
                            type: 'data'
                        }, 1);

                        setField(prev => ({ ...prev, loadingsearch: false }));
                        setPaging(prev => ({ ...prev, activePage: 1 }));
                    })();
                }, 1000);
                
                return () => clearTimeout(timeid);   
            }
        }
        //eslint-disable-next-line
    }, [field.search])

    const fetch = async (parameter, page) => {
        if(parameter.type === 'data'){
            props.setLoadingProgress(10);
        }

        try {
            await props.getOrder(parameter, page);
            if(parameter.type === 'count'){
                setCountFetched(true);
            }   
        } catch (error) {
            props.setMessage(error, true, 'error');
            props.setLoadingProgress(100);
        }
    }

    const handleChangeLimit = (value) => {
        setPaging(prev => ({ ...prev, limit: value, activePage: 1 }));
        fetch({ 
            ...defaultparams, 
            offset: 0, 
            limit: value,
            type: 'data'
        }, 1); //doesnt refresh total
    }

    const handleChangePage = (e, page) => {
        setPaging(paging => ({ ...paging, activePage: page }))
        fetch({ 
            ...defaultparams, 
            offset: (page * limit) - limit, 
            type: 'data'
        }, page); //doesnt refresh total
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setField(prev => ({ ...prev, [name]: value }));
        if(name === 'status'){
            setPaging(prev => ({ ...prev, activePage: 1}));
            setCountFetched(false);
            fetch({ 
                ...defaultparams, 
                offset: 0,
                type: 'count',
                status: value
            }, 1); //doesnt refresh total   
        }
    }

    var pagesrow        = orderlist[`page_${activePage}`] ? orderlist[`page_${activePage}`] : [];
    //var firstNumber     = (activePage * limit) - limit + 1;

    return(
        <Container>
            <ModalDetail 
                open={detail.open} 
                handleClose={() => setDetail(prev => ({ ...prev, open: false }))} 
                data={detail.data}
            />
            <div className={classes.root}>
                <Grid container spacing={2} justify='flex-end'>
                    <Grid item xs={6} sm={3} md={2}>
                        <FormControl fullWidth variant='outlined' size='small'>
                            <InputLabel htmlFor='show'>Tampilkan</InputLabel>
                            <Select
                                label='Tampilkan'
                                labelId='show'
                                value={paging.limit}
                                name='limit'
                                onChange={(e) => handleChangeLimit(e.target.value)}
                            >
                                <MenuItem value='6'>6</MenuItem>
                                <MenuItem value='24'>24</MenuItem>
                                <MenuItem value='60'>60</MenuItem>
                                <MenuItem value='114'>114</MenuItem>
                                <MenuItem value='168'>160</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <FormControl fullWidth variant='outlined' size='small'>
                            <InputLabel htmlFor='status'>Status</InputLabel>
                            <Select
                                label='Status'
                                labelId='status'
                                value={field.status}
                                name='status'
                                onChange={handleChange}
                            >
                                <MenuItem value='all'>All Status</MenuItem>
                                { statusorder.map(status => <MenuItem key={status.id} value={status.id}>
                                    { status.name }
                                </MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5} md={3}>
                        <FormControl fullWidth>
                            <TextField 
                                variant='outlined'
                                label='Search'
                                size='small'
                                placeholder='Cari kiriman (extid, nama barang)'
                                name='search'
                                autoComplete='off'
                                onChange={handleChange}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <ListOrder 
                    data={pagesrow}
                    onClickDetail={(data) => setDetail({ open: true, data })}
                />
                { totalorder > 0 && <div className={classes.paging}>
                    <Pagination
                        count={Math.ceil(totalorder / limit)} 
                        page={activePage}
                        shape='rounded'
                        color='secondary'
                        onChange={handleChangePage}
                    />
                </div> }
            </div>
        </Container>
    )
}

History.propTypes = {
    orderlist: PropTypes.object.isRequired,
    totalorder: PropTypes.number.isRequired,
    getOrder: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return{
        orderlist: state.orders.data,
        totalorder: state.orders.total,
        session: state.auth
    }
}

export default connect(mapStateToProps, { getOrder, setMessage, setLoadingProgress })(History);