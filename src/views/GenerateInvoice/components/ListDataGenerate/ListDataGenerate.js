import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { decimalNumber } from '../../../../utils';
import StyledCheckbox from '../../../../components/StyledCheckBox';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        overflowX: "auto",
        marginTop: theme.spacing(2)
    },
    cell: {
        //fontSize: '13px', 
        // borderWidth: 1, 
        // borderColor: '#e8e8e8',
        //borderStyle: 'solid'
    }
}))

const ListDataGenerate = props => {
    const { list } = props;
    const classes = useStyles();

    var no = 1;

    return(
        <React.Fragment>
            <TableContainer className={classes.root} component={Paper}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.cell} />
                            <TableCell className={classes.cell}>NO</TableCell>
                            <TableCell className={classes.cell}>PO NUMBER</TableCell>
                            <TableCell className={classes.cell}>DESKRIPSI</TableCell>
                            <TableCell className={classes.cell} align='right'>KUANTITAS</TableCell>
                            <TableCell className={classes.cell} align='right'>HARGA TOTAL</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { list.map((row, index) => <TableRow key={index}>
                            <TableCell className={classes.cell}>
                                <StyledCheckbox 
                                    checked={row.checked}
                                    onChange={(e) => props.onChangeChecked(e.target.checked, index)}
                                />
                            </TableCell>
                            <TableCell className={classes.cell}>{no++}</TableCell>
                            <TableCell className={classes.cell}>{row.ponumber} LINE {row.linenumber}</TableCell>
                            <TableCell className={classes.cell}>{row.keterangan.toUpperCase()}</TableCell>
                            <TableCell className={classes.cell} align='right'>{decimalNumber(row.qty)}</TableCell>
                            <TableCell className={classes.cell} align='right'>{decimalNumber(row.harga)}</TableCell>
                        </TableRow>) }
                        <TableRow>
                            <TableCell colSpan={5}>TOTAL</TableCell>
                            <TableCell className={classes.cell} align='right'>
                                { decimalNumber(list.reduce((a, b) => { return a + Number(b.harga) }, 0)) }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            
        </React.Fragment>
    );
}

ListDataGenerate.propTypes = {
    list: PropTypes.array.isRequired,
    onChangeChecked: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
}

export default ListDataGenerate;