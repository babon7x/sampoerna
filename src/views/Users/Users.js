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

const useStyles = makeStyles(theme => ({
    root: {

    },
    actions: {
        justifyContent: 'flex-end'
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
    }, [mount]);

    useEffect(() => {
        if(countFetched){
            fetch({ ...defaultparams, type: 'data' }, activePage);
        }
        //eslint-disable-next-line
    }, [countFetched]);

    const hanldeFilter = (params) => {
        setMount({ ready: true, params })
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
            console.log(error);
        }
    }

    const handleChangePage = (e, page) => {
        setPaging(paging => ({ ...paging, activePage: page }))
        // const parameter = {
        //     ...defaultparams,
        //     offset: (page * limit) - limit, //refresh offset value with change activepage in state
        // }

        //fetch(parameter, 'data', page);
    }

    var pagesrow        = userlist[`page_${activePage}`] ? userlist[`page_${activePage}`] : [];
    var firstNumber     = (activePage * limit) - limit + 1;

    return(
        <animated.div style={fadeAnime}>
            <Card className={classes.root}>
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
}

function mapStateToProps(state){
    return{
        regions: state.region,
        userlist: state.users.data,
        totalusers: state.users.total,
        session: state.auth
    }
}

export default connect(mapStateToProps, { getData, setLoadingProgress } )(Users);