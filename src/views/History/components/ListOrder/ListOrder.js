import { Button, Card, CardActions, CardHeader, Divider, Grid, IconButton, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types'
import { Alert, AlertTitle } from '@material-ui/lab';
import { List, Link } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText, Icon } from '@material-ui/core';
import { capitalize, decimalNumber } from '../../../../utils';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(1),
        position: 'relative',
        minHeight: '60vh'
    },
    link: {
        cursor: 'pointer'
    },
    icon: {
        color: 'green',
        fontSize: 14
    },
    iconred: {
        color: 'red',
        fontSize: 14
    }
}))

const ListOrder = props => {
    const classes = useStyles();
    const { data } = props;

    return(
        <div className={classes.root}>
            <Grid container spacing={3} justify='center' alignItems='center' style={{minHeight: '60vh'}}>
                { data.length > 0 ? data.map(order => <Grid key={order.extid} item xs={12} sm={4} md={4}>
                    <Card raised style={{width: '100%'}}>
                        <CardHeader 
                            subheader={`PO (${order.ponumber} - LINE ${order.linenumber})`} 
                            action={<IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                size='small'
                            >
                                <Icon fontSize='small'>more_vert</Icon>
                            </IconButton>}
                        />
                        <Divider />
                        <List disablePadding>
                            <ListItem dense>
                                <ListItemText 
                                    primary={`ID ${order.extid}`}
                                    secondary={<React.Fragment>
                                        Deskripsi : {order.isikiriman} <br/>
                                        Status : {order.description}
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            Fee : { order.status !== 0 ? 
                                                order.totalfeereal === null ? <React.Fragment>
                                                        &nbsp;Rp. {decimalNumber(order.totalfee)}
                                                    </React.Fragment> :
                                                <React.Fragment>
                                                    {`${decimalNumber(order.totalfee)} => `} 
                                                    &nbsp;<strong>Rp. {decimalNumber(order.totalfeereal)}</strong>
                                                </React.Fragment>
                                            : `Rp. ${decimalNumber(order.totalfee)}`  }
                                        </div>
                                    </React.Fragment> }
                                />
                            </ListItem>
                            <ListItem dense>
                                <ListItemText 
                                    primary='Penerima'
                                    secondary={`${capitalize(order.receivername)} (${capitalize(order.receivercity)}, ${capitalize(order.receiverkec)}, ${capitalize(order.receiverkel)} - ${order.receiverposcode})`} 
                                />
                            </ListItem>
                        </List>
                        <CardActions style={{justifyContent: 'center'}}>
                            <Button 
                                variant='outlined' 
                                onClick={() => props.onClickDetail(order)} 
                                fullWidth
                            >
                                Lihat detail
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>) : <Grid item xs={12} sm={4}>
                        <Alert variant='outlined' severity='error' className={classes.alert}>
                            <AlertTitle>Opps! data tidak ditemukan</AlertTitle> 
                            <strong>Silahkan klik&nbsp;
                            <Link 
                                className={classes.link} 
                                underline='none'
                                component={NavLink}
                                to="/order"
                            >disini</Link> untuk order</strong>
                        </Alert>
                </Grid> }                
            </Grid>
        </div>
    )
}

ListOrder.propTypes = {
    data: PropTypes.array.isRequired,
    onClickDetail: PropTypes.func.isRequired,
}

export default ListOrder;