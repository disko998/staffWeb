import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import VisibilityIcon from '@material-ui/icons/Visibility'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
})

export default function JobsTable({ jobs, selectedTable, onShowBids }) {
    const classes = useStyles()

    const filteredJobs = jobs.filter(job => {
        if (selectedTable === 'Vacant') {
            return job.type == 'Vacant' && new Date(job.date) >= new Date()
        } else if (selectedTable === 'Filled') {
            return job.type == 'Filled'
        } else if (selectedTable === 'Unfilled') {
            return job.type == 'Vacant' && new Date(job.date) < new Date()
        } else {
            return jobs
        }
    })

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='simple table'>
                <TableHead>
                    <TableRow>
                        <TableCell>Job Number</TableCell>
                        <TableCell align='right'>Name</TableCell>
                        <TableCell align='right'>Site</TableCell>
                        <TableCell align='right'>Department</TableCell>
                        <TableCell align='right'>Ward</TableCell>
                        <TableCell align='right'>Manager</TableCell>
                        <TableCell align='right'>Cost</TableCell>
                        <TableCell align='right'>Date</TableCell>
                        <TableCell align='right'>Show</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredJobs.map(job => (
                        <TableRow key={job.id}>
                            <TableCell component='th' scope='row'>
                                {job.jobNo}
                            </TableCell>
                            <TableCell align='right'>{job.name}</TableCell>
                            <TableCell align='right'>{job.site}</TableCell>
                            <TableCell align='right'>{job.dep}</TableCell>
                            <TableCell align='right'>{job.ward}</TableCell>
                            <TableCell align='right'>{job.manager}</TableCell>
                            <TableCell align='right'>{job.cost}</TableCell>
                            <TableCell align='right'>
                                {new Date(job.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell align='right'>
                                {selectedTable === 'Vacant' && (
                                    <Button
                                        onClick={onShowBids(job)}
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        className={classes.button}
                                        startIcon={<VisibilityIcon />}
                                    >
                                        Bids
                                    </Button>
                                )}
                                {selectedTable === 'Filled' && (
                                    <Button
                                        onClick={onShowBids(job)}
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        className={classes.button}
                                        startIcon={<VisibilityIcon />}
                                    >
                                        Hires
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
