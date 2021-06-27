import { Card, CardActions, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { OfficeFilter } from '../../components';
import { useSpring, animated } from 'react-spring';
import { CardHeader } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { getData } from '../../actions/users';
import { Pagination } from '@material-ui/lab';
import { ListUser } from './components';
import { setLoadingProgress } from '../../actions/loadingprogress';
import { Button, Icon } from '@material-ui/core';
import { setMessage } from '../../actions/notification';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(2)
    },
    actions: {
        justifyContent: 'flex-end'
    },
    title: {
        marginBottom: 10
    }
}))

const Users = props => {
    const { session, totalusers, userlist } = props;
    const fadeAnime = useSpring({ to: {opacity: 1}, from: {opacity: 0}, delay: 200 });
    const classes = useStyles();
    const [mount, setMount] = useState({ ready: false, params: {}})
    const [paging, setPaging] = useState({limit: 10, activePage: 1});
    const [countFetched, setCountFetched] = useState(false);

    const { limit, activePage } = paging;
    const offsetValue = (activePage * limit) - limit;
    const defaultparams = {
        limit,
        offset: offsetValue,
        region: mount.params.reg ? mount.params.reg : '00',
        kprk: mount.params.kprk ? mount.params.kprk : '00',
        search: mount.params.search ? mount.params.search : undefined,
        token: session.token,
        userid: session.userid,
        type: 'count'
    }

    useEffect(() => {
        if(mount.ready){
            fetch(defaultparams, 1);
        }
        //eslint-disable-next-line
    }, [mount.ready]);

    useEffect(() => {
        if(countFetched){
            fetch({ ...defaultparams, type: 'data' }, activePage);
        }
        //eslint-disable-next-line
    }, [countFetched]);

    const hanldeFilter = (params) => {
        setMount({ ready: true, params })

        if(mount.ready){    
            const newparams = {
                ...defaultparams,
                offset: 0,
                ...params
            }

            handleFilter(newparams);
        }
    }

    const fetch = async (parameter, page) => {
        if(parameter.type === 'data'){
            props.setLoadingProgress(10);
        }

        try {
            await props.getData(parameter, page);
            if(parameter.type === 'count'){
                setCountFetched(true);
            }   
        } catch (error) {
            props.setMessage(error, true, 'error');
            props.setLoadingProgress(100);
        }
    }

    //must reset page to 1
    const handleFilter = (parameter) => {
        setPaging(prev => ({ ...prev, activePage: 1 }));

        props.setLoadingProgress(10);

        props.getData({ ...parameter, type: 'count' }, 1)
            .then(async () => {
                try {
                    await props.getData({ ...parameter, type: 'data' }, 1);
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

    const handleChangePage = (e, page) => {
        setPaging(paging => ({ ...paging, activePage: page }))
        const parameter = {
            ...defaultparams,
            type: 'data',
            offset: (page * limit) - limit, //refresh offset value with change activepage in state
        }

        fetch(parameter, page);
    }

    var pagesrow        = userlist[`page_${activePage}`] ? userlist[`page_${activePage}`] : [];
    var firstNumber     = (activePage * limit) - limit + 1;

    return(
        <animated.div style={fadeAnime} className={classes.root}>
            <Button 
                variant='contained' 
                startIcon={<Icon>add</Icon>}
                component={NavLink}
                to="/users/add"
            >
                TAMBAH PENGGUNA
            </Button>
            <Card style={{marginTop: 15}}>
                <CardHeader 
                    title={<OfficeFilter 
                        listregion={props.regions}
                        onFilter={hanldeFilter}
                    />}
                />
                <ListUser 
                    list={pagesrow}
                    firstNumber={firstNumber}
                />
                <CardActions className={classes.actions}>
                    <Pagination 
                        count={Math.ceil(totalusers / limit)} 
                        page={activePage}
                        shape='rounded'
                        color='secondary'
                        onChange={handleChangePage}
                    />
                </CardActions>
            </Card>
        </animated.div>
    )
}

Users.propTypes = {
    regions: PropTypes.array.isRequired,
    userlist: PropTypes.object.isRequired,
    totalusers: PropTypes.number.isRequired,
    session: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    setLoadingProgress: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
}

function mapStateToProps(state){
    return{
        regions: state.region,
        userlist: state.users.data,
        totalusers: state.users.total,
        session: state.auth
    }
}

export default connect(mapStateToProps, { 
    getData, 
    setLoadingProgress,
    setMessage 
})(Users);