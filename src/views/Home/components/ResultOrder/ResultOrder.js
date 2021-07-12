import { Card, CardContent, Grid, Icon, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
    content: {
        display: 'flex',
        alignItems: 'center'
    },
    summary: {
        marginLeft: theme.spacing(2)
    }
}))

const ResultOrder = props => {
    const { list } = props;
    const classes = useStyles();

    return(
        <Grid container spacing={2}>
            { list.map(result => <Grid item xs={12} sm={6} md={3} lg={3} key={result.description}>
                <Card>
                    <CardContent className={classes.content}>
                        <Icon>{result.icon}</Icon>
                        <div className={classes.summary}>
                            <Typography variant='h6'>{result.description}</Typography>
                            <Typography variant='body2'>
                                { result.jumlah > 0 ? `Ada ${result.jumlah} kiriman` : `${result.jumlah} kiriman` }
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
            </Grid>) }
        </Grid>
    )
}

ResultOrder.propTypes = {
    list: PropTypes.array.isRequired,
}

export default ResultOrder;