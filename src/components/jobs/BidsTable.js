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
import IconButton from '@material-ui/core/IconButton'

import WorkIcon from '@material-ui/icons/Work'
import MessageIcon from '@material-ui/icons/Message'
import PaymentIcon from '@material-ui/icons/Payment'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    back: {
        marginBottom: 15,
    },
})

export default function BidsTable({
    bids,
    onShowJobs,
    onMessage,
    onHire,
    currentJob,
    onApprovePayment,
}) {
    const classes = useStyles()

    return (
        <React.Fragment>
            <IconButton aria-label='back' onClick={onShowJobs} className={classes.back}>
                <ArrowBackIcon />
            </IconButton>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Job Number</TableCell>
                            <TableCell align='right'>Date</TableCell>
                            <TableCell align='right'>Price</TableCell>
                            <TableCell align='right'>Freelancer</TableCell>
                            <TableCell align='right'>Times</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bids.map(bid => (
                            <TableRow key={bid.id}>
                                <TableCell component='th' scope='row'>
                                    {bid.date}
                                </TableCell>
                                <TableCell align='right'>{bid.price}</TableCell>
                                <TableCell align='right'>{bid.freelancerName}</TableCell>
                                <TableCell align='right'>
                                    {bid.times.join(', ')}
                                </TableCell>
                                <TableCell align='right'>
                                    <Button
                                        onClick={onMessage(bid)}
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        className={classes.button}
                                        startIcon={<MessageIcon />}
                                    >
                                        Message
                                    </Button>
                                </TableCell>
                                {currentJob.type === 'Vacant' && (
                                    <TableCell align='right'>
                                        <Button
                                            onClick={onHire(bid)}
                                            variant='contained'
                                            color='primary'
                                            size='small'
                                            className={classes.button}
                                            startIcon={<WorkIcon />}
                                        >
                                            Hire
                                        </Button>
                                    </TableCell>
                                )}
                                {currentJob.type === 'Filled' && !currentJob.completed && (
                                    <TableCell align='right'>
                                        <Button
                                            onClick={onApprovePayment(bid)}
                                            variant='contained'
                                            color='primary'
                                            size='small'
                                            className={classes.button}
                                            startIcon={<PaymentIcon />}
                                        >
                                            Approve Payment
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}
