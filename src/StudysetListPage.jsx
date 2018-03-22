import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

/**
 * This component represents all of the studysets of the user in a list form
 */
export default class StudysetListPage extends React.Component {
    render() {
        const rows = this.props.studysets.map(studyset => {
            return (
                <TableRow>
                    <TableCell>
                        <NavLink 
                            to = {`/studyset/${studyset._id}`}
                            style={{ color: 'inherit', textDecoration: 'none', width: '100%'}}
                        >{studyset.name}</NavLink>
                    </TableCell>
                    <TableCell numeric>{studyset.exercises.length}</TableCell>
                </TableRow>
            )
        })

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell numeric>Number of tasks</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        );
    }
}