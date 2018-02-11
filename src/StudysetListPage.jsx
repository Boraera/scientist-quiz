import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

/**
 * This component represents all of the studysets of the user in a list form
 */
export default class StudysetListPage extends React.Component {

    render() {
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
}