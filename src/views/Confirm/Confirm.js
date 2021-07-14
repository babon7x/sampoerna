import { Grid //makeStyles 
} from '@material-ui/core';
//import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
//import React, { useState } from 'react';

// const useStyles = makeStyles(theme => ({
//     root: {
//         width: '100%'
//     }
// }))

const Confirm = props => {
    //const classes = useStyles();

    //const [loading, setloading] = useState(true);

    return(
        <Grid 
            container 
            justify='center' 
            alignItems='center' 
            //className={classes.root}
        >
            <p>hello world</p>
        </Grid>
    )
}

export default Confirm;