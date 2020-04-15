import React, { useState } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { Grid, Fab, Typography, Box, Divider } from '@material-ui/core'

import Jobs from '../jobs/Jobs'
import { calculateJobsLength } from '../../utilities/helper'
import { useJobBoardStyle } from './Styles'

const JobBoard = ({ jobs, auth, history }) => {
    if (!auth.uid) return <Redirect to='/signin' />

    const classes = useJobBoardStyle()
    const [state, setState] = useState({
        selectedTable: 'Vacant',
        showBids: false,
    })

    const { vacantSize, filledSize, unfilledSize } = calculateJobsLength(jobs)

    const handleClick = table => {
        setState({
            selectedTable: table,
            showBids: false,
        })
    }

    const onShowBids = () => {
        setState({ ...state, showBids: true })
    }

    const onShowJobs = () => {
        setState({ ...state, showBids: false })
    }

    return (
        <Box mt={5}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4} className={classes.card}>
                    <Fab
                        onClick={() => handleClick('Vacant')}
                        className={[classes.button, classes.vacant]}
                        size='medium'
                        aria-label='vacantSize'
                    >
                        {vacantSize}
                    </Fab>
                    <Typography variant='h5'>Vacant Shifts</Typography>
                </Grid>
                <Grid item xs={12} sm={4} className={classes.card}>
                    <Fab
                        onClick={() => handleClick('Filled')}
                        className={[classes.button, classes.filled]}
                        size='medium'
                        aria-label='filledSize'
                    >
                        {filledSize}
                    </Fab>
                    <Typography variant='h5'>Filled Shifts</Typography>
                </Grid>
                <Grid item xs={12} sm={4} className={classes.card}>
                    <Fab
                        onClick={() => handleClick('Unfilled')}
                        className={[classes.button, classes.unfilled]}
                        size='medium'
                        aria-label='unfilledSize'
                    >
                        {unfilledSize}
                    </Fab>
                    <Typography variant='h5'>Unfilled Shifts</Typography>
                </Grid>
            </Grid>
            <Divider style={{ margin: '20px 0' }} />
            <Jobs
                selectedTable={state.selectedTable}
                history={history}
                handleClick={handleClick}
                showBids={state.showBids}
                onShowBids={onShowBids}
                onShowJobs={onShowJobs}
            />
        </Box>
    )
}

const mapStateToProps = (state, ownProps) => ({
    jobs: state.firestore.ordered.jobs,
    auth: state.firebase.auth,
})

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => [
        {
            collection: 'jobs',
            where: ['d.uid', '==', props.auth.uid],
        },
    ]),
)(JobBoard)
