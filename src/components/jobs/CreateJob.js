import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { useToasts } from 'react-toast-notifications'
import DateFnsUtils from '@date-io/date-fns'
import {
    TextField,
    Button,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Chip,
    Input,
    Checkbox,
    IconButton,
    ListItemText,
} from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import MyLocationIcon from '@material-ui/icons/MyLocation'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import NoteAddIcon from '@material-ui/icons/NoteAdd'

import { formatDate } from '../../utilities/helper'
import FormWrapper from '../layout/FormWrapper'
import { useStyle, MenuProps } from './Styles'

const Timeslots = [
    '00:00',
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
    '7:00',
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
]

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
        currentSlot: [],
    })

    console.log(shift)

    const handleChange = e => {
        setShift({
            ...shift,
            [e.target.name]: e.target.value,
        })
    }

    const handleDateChange = value => {
        setShift({
            ...shift,
            startDate: value,
        })
    }

    const addSlot = () => {
        const formattedDate = formatDate(shift.startDate)
        setShift({
            ...shift,
            slots: { [formattedDate]: shift.currentSlot, ...shift.slots },
            currentSlot: [],
            startDate: new Date(),
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
    }

    const redirectToSignIn = e => history.push('/signin')

    const renderTimePicker = (
        <FormControl required>
            <InputLabel id='time'>Time</InputLabel>
            <Select
                labelId='time'
                name='currentSlot'
                id='currentSlot'
                value={shift.currentSlot}
                multiple
                onChange={handleChange}
                label='Time'
                MenuProps={MenuProps}
                input={<Input />}
                renderValue={selected => (
                    <div className={classes.chips}>
                        {selected.map(value => (
                            <Chip key={value} label={value} className={classes.chip} />
                        ))}
                    </div>
                )}
            >
                {Timeslots.map(time => (
                    <MenuItem value={time} key={time}>
                        <Checkbox checked={shift.currentSlot.indexOf(time) > -1} />
                        <ListItemText primary={time} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )

    return (
        <FormWrapper onSubmit={handleSubmit} title='Create Job' onBack={redirectToSignIn}>
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
            <div className={`${classes.row} ${classes.space}`}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        required
                        margin='normal'
                        id='startDate'
                        label='Date'
                        format='MM/dd/yyyy'
                        value={shift.startDate}
                        minDate={new Date()}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
                {renderTimePicker}
                {!!shift.currentSlot.length && (
                    <IconButton
                        onClick={addSlot}
                        aria-label='add'
                        color='primary'
                        size='medium'
                    >
                        <AddCircleIcon fontSize='large' />
                    </IconButton>
                )}
            </div>
            <div className={`${classes.row} ${classes.space}`}>
                <InputLabel>Location:</InputLabel>
                <Button
                    variant='contained'
                    color='secondary'
                    className={classes.button}
                    startIcon={<MyLocationIcon />}
                >
                    Get location
                </Button>
                <Button
                    variant='contained'
                    color='secondary'
                    className={classes.button}
                    startIcon={<LocationOnIcon />}
                >
                    Saved location
                </Button>
            </div>
            <FormControl required variant='outlined' className={classes.space}>
                <InputLabel id='sites'>Sites</InputLabel>
                <Select
                    labelId='sites'
                    id='sites'
                    value={[]}
                    onChange={handleChange}
                    label='Sites'
                >
                    <MenuItem value=''>
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
            <FormControl required variant='outlined' className={classes.space}>
                <InputLabel id='deps'>Departments</InputLabel>
                <Select
                    labelId='deps'
                    id='deps'
                    value={[]}
                    onChange={handleChange}
                    label='Departments'
                >
                    <MenuItem value=''>
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
            <TextField
                required
                type='text'
                label='Cost'
                id='cost'
                name='cost'
                value={shift.cost}
                onChange={handleChange}
                className={classes.space}
            />
            <Button
                type='submit'
                className={classes.space}
                variant='contained'
                size='large'
                color='primary'
                startIcon={<NoteAddIcon />}
            >
                Create Job
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
