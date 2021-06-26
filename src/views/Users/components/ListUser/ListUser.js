import React from 'react';
import { 
    Table, 
    TableContainer, 
    TableHead,
    TableCell,
    TableRow,
    makeStyles,
    TableBody
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { SelectOption } from '../../../../components';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        overflowX: "auto"
    },
    cell: {
        fontSize: '13px', 
        borderWidth: 1, 
        // borderColor: '#e8e8e8',
        // borderStyle: 'solid'
    }
}))

const ListUser = props => {
    const classes = useStyles();
    const { list } = props;
    var no = props.firstNumber;

    return(
        <TableContainer className={classes.root}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>NO</TableCell>
                        <TableCell>OFFICE</TableCell>
                        <TableCell>NAMA</TableCell>
                        <TableCell>EMAIL</TableCell>
                        <TableCell>PHONE</TableCell>
                        <TableCell>LEVEL</TableCell>
                        <TableCell align='center'>ACTION</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { list.length > 0 ? list.map(user => <TableRow key={user.userid}>
                        <TableCell className={classes.cell} component="th" scope="row">{no++}</TableCell>
                        <TableCell className={classes.cell}>
                            {user.office} - {user.officename.toUpperCase()}
                        </TableCell>
                        <TableCell className={classes.cell}>{user.fullname.toUpperCase()}</TableCell>
                        <TableCell className={classes.cell}>{user.email}</TableCell>
                        <TableCell className={classes.cell}>{user.phone}</TableCell>
                        <TableCell className={classes.cell}>{user.levelname}</TableCell>
                        <TableCell className={classes.cell} align='center'>
                            <SelectOption 
                                list={[
                                    {
                                        text: 'Lihat detail', 
                                        onClick: () => console.log("a")
                                    },
                                    {
                                        text: 'Update',
                                        onClick: () => console.log("k")
                                    }
                                ]}
                            />
                        </TableCell>
                    </TableRow>): <TableRow>
                        <TableCell className={classes.cell}>No data found</TableCell>
                    </TableRow> }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

ListUser.propTypes = {
    list: PropTypes.array.isRequired,
    firstNumber: PropTypes.number.isRequired
}

export default ListUser;