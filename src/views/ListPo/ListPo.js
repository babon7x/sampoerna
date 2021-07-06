import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getPurchase } from '../../actions/purchase';
import { setMessage } from '../../actions/notification';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { Card, Chip, Container, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Select, FormControl, InputLabel, Grid } from '@material-ui/core';
import { CardActions, TableContainer } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { InputButton } from '../../components';
import { decimalNumber } from '../../utils';
import { Icon } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { animated, useSpringRef, useTransition } from 'react-spring';
import { ModalDetail } from './components';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        overflowX: "auto"
    },
    left: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
}))

const ListPo = props => {
    const { session, total, listpurchase } = props;
    const classes = useStyles();

    const transRef = useSpringRef();
    const transitions = useTransition(null, {
        ref: transRef,
        keys: null,
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    })

    const [paging, setPaging] = useState({
        limit: 13,
        activePage: 1
    })
    const [countFetched, setCountFetched] = useState(false);
    const [search, setSearch] = useState('');

    const { activePage, limit } = paging;
    const offsetValue = (activePage * limit) - limit;
    const defaultparams = {
        limit,
        offset: offsetValue,
        token: session.token,
        userid: session.userid,
        type: 'count',
        levelid: session.levelid
    }
    const [detail, setDetail] = useState({
        open: false,
        data: {}
    })

    useEffect(() => {
        fetch(defaultparams, 1);
        transRef.start();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(countFetched){
            fetch({ ...defaultparams, type: 'data' }, activePage);
        }
        //eslint-disable-next-line
    }, [countFetched]);

    useEffect(() => {
        if(!search && countFetched){
            setPaging(prev => ({ ...prev, activePage: 1 }))
            setCountFetched(false);
            fetch(defaultparams, 1);
        }
        //eslint-disable-next-line
    }, [search])

    const fetch = async (parameter, page) => {
        if(parameter.type === 'data'){
            props.setLoadingProgress(5);
        }

        try {
            await props.getPurchase(parameter, page);
            if(parameter.type === 'count'){
                setCountFetched(true);
            }   
        } catch (error) {
            props.setMessage(error, true, 'error');
            props.setLoadingProgress(100);
        }
    }

    const handleChangePage = (e, page) => {
        setPaging(paging => ({ ...paging, activePage: page }))
        const parameter = {
            ...defaultparams,
            type: 'data',
            offset: (page * limit) - limit, //refresh offset value with change activepage in state
            search: search ? search : undefined
        }

        fetch(parameter, page);
    }

    const handleChangeLimit = (e) => {
        const { value } = e.target;
        setPaging(prev => ({ ...prev, activePage: 1, limit: value }));
        const parameter = {
            ...defaultparams,
            type: 'data',
            offset: 0,
            limit: value
        }

        fetch(parameter, 1);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if(search){
            setPaging(prev => ({ ...prev, activePage: 1 }));
            const parameter = {
                ...defaultparams,
                limit,
                offset: 0,
                search
            }

            props.setLoadingProgress(5);

            props.getPurchase({ ...parameter, type: 'count' }, 1)
                .then(async () => {
                    try {
                        await props.getPurchase({ ...parameter, type: 'data' }, 1);
                    } catch (error) {
                        props.setMessage(error, true, 'error');
                    }
                    props.setLoadingProgress(100);
                })
                .catch(err => {
                    props.setLoadingProgress(100);
                    props.setMessage(err, true, 'error');
                })
        }
    }



    var pagesrow        = listpurchase[`page_${activePage}`] ? listpurchase[`page_${activePage}`] : [];
    var firstNumber     = (activePage * limit) - limit + 1;

    const list      = [];
    let grouping    = '';

    if(pagesrow.length > 0){
        for (let key = 0; key < pagesrow.length; key++) {
            const element = pagesrow[key];
            if(grouping !== element.ponumber){
                grouping = element.ponumber;
                list.push(
                    <React.Fragment key={key}>
                        <TableRow style={{backgroundColor: '#333333'}}>
                            <TableCell colSpan={6}>
                                PO NUMBER &nbsp; &nbsp;
                                <Chip 
                                    label={element.ponumber}  
                                    size='small'
                                    deleteIcon={<Icon fontSize='small'>visibility</Icon>}
                                    onDelete={() => setDetail({ open: true, data: element })}
                                    color="primary"
                                />
                            </TableCell> 
                        </TableRow>
                        <TableRow>
                            <TableCell>{firstNumber}</TableCell>
                            <TableCell>Line ke - {element.linenumber}</TableCell>
                            <TableCell>{element.keterangan}</TableCell>
                            <TableCell align='center'>{element.startdate} - {element.enddate}</TableCell>
                            <TableCell align='right'>{decimalNumber(element.bsu_awal)}</TableCell>                            
                            <TableCell align='right'>{decimalNumber(element.bsu)}</TableCell>                            
                        </TableRow>
                    </React.Fragment>
                )
            }else{
                list.push(
                    <TableRow key={key}>
                        <TableCell>{firstNumber}</TableCell>
                        <TableCell>Line ke - {element.linenumber}</TableCell>
                        <TableCell>{element.keterangan}</TableCell>
                        <TableCell align='center'>{element.startdate} - {element.enddate}</TableCell>
                        <TableCell align='right'>{decimalNumber(element.bsu_awal)}</TableCell>
                        <TableCell align='right'>{decimalNumber(element.bsu)}</TableCell>
                    </TableRow>
                )
            }

            firstNumber++;
        }
    }

    return(
        <Container>
            <ModalDetail 
                open={detail.open}
                data={detail.data}
                handleClose={() => setDetail(prev => ({ ...prev, open: false }))}
            />
            <Grid container spacing={2} justify='space-between' alignItems='center'>
                <Grid item xs={12} sm={6}>
                    <Typography variant='h6'>Rekap data purchase order</Typography>
                    
                </Grid>
                <Grid item xs={12} sm={6}>
                    <form className={classes.left} onSubmit={handleSearch}>
                        <FormControl variant='outlined' fullWidth size='small' style={{marginRight: 10, maxWidth: 80}}>
                            <InputLabel htmlFor='show'>Show</InputLabel>
                            <Select
                                value={limit}
                                labelId='show'
                                label='Show'
                                onChange={handleChangeLimit}
                            >
                                { ['13','30','70','100','150','200'].map(list => 
                                    <MenuItem value={list} key={list}>
                                        { list }
                                    </MenuItem>)}
                            </Select>
                        </FormControl>
                        <InputButton 
                            label='Search'
                            placeholder='Cari po number disini...'
                            buttonlable='Filter'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </Grid>
            </Grid>
            <Card style={{marginTop: 10}}>
                { transitions(style => <animated.div style={{...style}}>
                    <TableContainer className={classes.root}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>NO</TableCell>
                                    <TableCell>LINE NUMBER</TableCell>
                                    <TableCell>DESKRIPSI</TableCell>
                                    <TableCell align='center'>PERIODE</TableCell>
                                    <TableCell align='right'>BESAR UANG</TableCell>
                                    <TableCell align='right'>TERSISA</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </animated.div>)}
                <CardActions style={{justifyContent: 'flex-end'}}>
                    <Pagination 
                        count={Math.ceil(total / limit)} 
                        page={activePage}
                        shape='rounded'
                        color='secondary'
                        onChange={handleChangePage}
                    />
                </CardActions>
            </Card>
        </Container>
    )
}

ListPo.propTypes = {
    getPurchase: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    listpurchase: PropTypes.object.isRequired,
}

function mapStateToProps(state){
    return {
        session: state.auth,
        total: state.purchase.total,
        listpurchase: state.purchase.data
    }
}

export default connect(mapStateToProps, { 
    getPurchase, 
    setMessage,
    setLoadingProgress 
})(ListPo);