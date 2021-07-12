import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';

const PoUsed = props => {
    return(
        <Card style={{position: 'relative', minHeight: '80vh'}}>
            <CardContent>
                <Typography>PO USED</Typography>
            </CardContent>
        </Card>
    )
}

export default PoUsed;