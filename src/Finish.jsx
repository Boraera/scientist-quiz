import React from 'react'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';


export default function(props) {
    return (
        <Table>
            <TableBody>
                {() => props.answers.map((answer, index) => (<TableRow></TableRow>))}
            </TableBody>
        </Table> 
    )
};
