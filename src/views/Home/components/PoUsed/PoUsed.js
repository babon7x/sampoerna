import { Button, Card, CardActions, CardHeader, Divider, Icon, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types'
import { Alert } from '@material-ui/lab';
import { decimalNumber } from '../../../../utils';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative', 
        height: '78%',
        '& > *': {
            margin: theme.spacing(1.2)
        },
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'auto'
        //justifyContent: 'center'
    },
    footer: {
        justifyContent: 'flex-end'
    },
    empty: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    }
}))

const PoUsed = props => {
    const classes = useStyles();
    const { list } = props;
    return(
        <Card raised style={{height: '100%'}}>
            <CardHeader title='Purchase Order' subheader='Daftar po yang sudah digunakan' />
            <Divider />
            <div className={classes.root}>
                { list.length > 0 ? list.map((po, index) => 
                    <Alert key={index} variant='filled'severity='warning'>
                        {po.ponumber} line {po.linenumber} <br />
                        Tersisa {po.persen}% dari saldo awal Rp. {decimalNumber(po.saldo)}
                    </Alert>) : <div className={classes.empty}>
                        <Typography variant='body2' align='center'>Tidak ditemukan data purchase order yang sudah digunakan</Typography>
                    </div>}
            </div>
            <Divider />
            <CardActions className={classes.footer}>
                <Button 
                    variant='outlined' 
                    endIcon={<Icon>arrow_forward</Icon>}
                    onClick={props.onClick}
                >
                    Lihat semua
                </Button>
            </CardActions>
        </Card>
    )
}

PoUsed.propTypes = {
    list: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default PoUsed;