import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

export default function() {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell numeric>Score</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Student1</TableCell>
                    <TableCell numeric>1</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Student2</TableCell>
                    <TableCell numeric>2</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}
