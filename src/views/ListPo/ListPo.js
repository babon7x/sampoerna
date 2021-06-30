import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getPurchase } from '../../actions/purchase';
import { setMessage } from '../../actions/notification';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { Card, Chip, Container, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { CardHeader, Divider, CardActions, TableContainer } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { InputButton } from '../../components';
import { decimalNumber } from '../../utils';
import { Icon } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        overflowX: "auto"
    }
}))

const ListPo = props => {
    const { session, total, listpurchase } = props;
    const classes = useStyles();
    const [paging, setPaging] = useState({
        limit: 10,
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
        }

        fetch(parameter, page);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        alert(search);
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
                            <TableCell colSpan={4}>
                                PO NUMBER &nbsp; &nbsp;
                                <Chip 
                                    label={element.ponumber}  
                                    size='small'
                                    deleteIcon={<Icon fontSize='small'>help</Icon>}
                                    onDelete={() => alert("oke")}
                                    color="primary"
                                />  
                                &nbsp; &nbsp; &nbsp;periode {element.startdate} sampai {element.enddate}
                            </TableCell> 
                        </TableRow>
                        <TableRow>
                            <TableCell>{firstNumber}</TableCell>
                            <TableCell>Line ke - {element.linenumber}</TableCell>
                            <TableCell>{element.keterangan}</TableCell>
                            <TableCell align='right'>Rp. {decimalNumber(element.bsu)}</TableCell>                            
                        </TableRow>
                    </React.Fragment>
                )
            }else{
                list.push(
                    <TableRow key={key}>
                        <TableCell>{firstNumber}</TableCell>
                        <TableCell>Line ke - {element.linenumber}</TableCell>
                        <TableCell>{element.keterangan}</TableCell>
                        <TableCell align='right'>Rp. {decimalNumber(element.bsu)}</TableCell>
                    </TableRow>
                )
            }

            firstNumber++;
        }
    }

    return(
        <Container>
            <Card style={{marginTop: 10}}>
                <CardHeader 
                    title='Purchase Order'
                    subheader='Rekap data purchase order'
                    action={<form style={{marginTop: 13}} onSubmit={handleSearch}>
                        <InputButton 
                            label='Search'
                            placeholder='Cari po number disini...'
                            buttonlable='Filter'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>}
                />
                <Divider />
                <TableContainer className={classes.root}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>NO</TableCell>
                                <TableCell>LINE NUMBER</TableCell>
                                <TableCell>DESKRIPSI</TableCell>
                                <TableCell align='right'>BESAR UANG</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list}
                        </TableBody>
                    </Table>
                </TableContainer>
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