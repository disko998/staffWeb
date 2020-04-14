import React, { useState, useEffect } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { useToasts } from 'react-toast-notifications'
import { Card, Grid, Typography, TextField, Button } from '@material-ui/core'
import MomentUtils from '@date-io/moment'
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers'

import FormWrapper from '../layout/FormWrapper'
import { useStyle } from './Styles'

const CreateJob = ({ auth, deps, sites, profile, history }) => {
    if (!auth.uid) return <Redirect to='/signin' />

    const { addToast } = useToasts()
    const classes = useStyle()
    const [shift, setShift] = useState({
        jobNo: Math.floor(100000 + Math.random() * 900000),
        name: '',
        site: '',
        dep: '',
        cost: '',
        showFundShift: false,
        showSubmitButton: false,
        latitude: '',
        longitude: '',
        startDate: new Date(),
        slots: {},
        currentSlot: new Date(),
    })

    const time = new Date('2014-08-18T21:11:54')

    const handleChange = e => {
        setShift({
            ...shift,
            [e.target.name]: e.target.value,
        })
    }

    const handleDateChange = value => {
        console.log(value)
    }

    const handleSubmit = e => {
        e.preventDefault()
    }

    const redirectToSignIn = e => history.push('/signin')

    return (
        <FormWrapper onSubmit={handleSubmit} title='Create Job' onBack={history.goBack}>
            <TextField
                required
                type='number'
                label='Job Number'
                disabled
                id='jobNo'
                name='jobNo'
                value={shift.jobNo}
                onChange={handleChange}
                className={classes.space}
            />
            <TextField
                required
                type='text'
                label='Name'
                id='name'
                name='name'
                value={shift.name}
                onChange={handleChange}
                className={classes.space}
            />
            <div className={classes.row}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        margin='normal'
                        id='startDate'
                        label='Date'
                        format='MM/dd/yyyy'
                        value={shift.startDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardTimePicker
                        margin='normal'
                        id='currentSlot'
                        label='Time picker'
                        value={time}
                        onChange={handleDateChange}
                        views='hours'
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <Button
                type='submit'
                className={classes.space}
                variant='contained'
                size='large'
                color='primary'
            >
                Login
            </Button>
        </FormWrapper>
    )
}

const mapStateToProps = state => ({
    deps: state.firestore.ordered.deps,
    sites: state.firestore.ordered.sites,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
})

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => [
        {
            collection: 'deps',
            where: ['uid', '==', props.auth.uid],
        },
        {
            collection: 'sites',
            where: ['uid', '==', props.auth.uid],
        },
    ]),
)(CreateJob)
