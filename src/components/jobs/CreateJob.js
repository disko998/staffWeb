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

import MyLocationIcon from '@material-ui/icons/MyLocation'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import NoteAddIcon from '@material-ui/icons/NoteAdd'

import Strings, { Timeslots } from '../../utilities/Strings'
import { formatDate } from '../../utilities/helper'
import { Maps } from '../sites/Map'
import { FormWrapper, Slots } from '../layout'
import { useStyle, MenuProps } from './Styles'

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
        showSubmitButton: false,
        latitude: '',
        longitude: '',
        startDate: new Date(),
        slots: {},
        currentSlot: [],
    })
    const {
        jobNo,
        name,
        site,
        dep,
        cost,
        latitude,
        longitude,
        startDate,
        slots,
        firestore,
    } = shift

    const validateBeforeSubmit = () => {
        //Validate inputs
        const isValid =
            jobNo &&
            name &&
            //site &&
            //dep &&
            cost &&
            latitude &&
            longitude &&
            Object.keys(slots).length

        !isValid &&
            addToast('Please fill out the form correctly', {
                appearance: 'error',
                autoDismiss: true,
            })

        // Validate founds
        const number = Object.values(slots).reduce((next, s) => {
            return (next += s.length)
        }, 0)
        const totalCost = number * cost

        if (profile.budget < totalCost) {
            addToast(
                'Insufficient funds in the account. Please add more funds or tell your owner to allocate more',
                {
                    appearance: 'error',
                    autoDismiss: true,
                },
            )
            return false
        }

        return true
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (!validateBeforeSubmit()) return

        const itemToAdd = {
            jobNo,
            Name: name,
            site,
            dep,
            cost,
            type: 'Vacant',
            uid: auth.uid,
            latitude: latitude,
            longitude: longitude,
            slots: slots,
            agencyName: `${profile.firstName} ${profile.lastName}`,
        }

        // this.props.firestore.add({ collection: "jobs" }, itemToAdd);

        fetch(`${Strings.BASE_URL}/saveJobs`, {
            method: 'POST',
            body: JSON.stringify(itemToAdd),
        })
            .then(response => {
                console.log('Cloud function response', response)

                const number = Object.values(slots).reduce((next, s) => {
                    return (next += s.length)
                }, 0)
                const totalCost = number * cost
                const budget = profile.budget - totalCost

                firestore.update({ collection: 'Users', doc: auth.uid }, { budget })

                redirectToJobBoard()
            })
            .catch(err => {
                console.error(err)
            })
    }

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

    const onAddSlot = () => {
        const formattedDate = formatDate(shift.startDate)
        setShift({
            ...shift,
            slots: { [formattedDate]: shift.currentSlot, ...shift.slots },
            currentSlot: [],
            startDate: new Date(),
        })
    }

    const onSlotRemove = key => {
        const copySlots = shift.slots
        delete copySlots[key]
        setShift({
            ...shift,
            slots: copySlots,
        })
    }

    const useCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position =>
                setShift({
                    ...shift,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }),
            err =>
                addToast('Please share your location', {
                    appearance: 'warning',
                    autoDismiss: true,
                }),
        )
    }

    const useSavedLocation = () => {
        setShift({
            ...shift,
            latitude: Number(profile.latitude),
            longitude: Number(profile.longitude),
        })
    }

    const redirectToJobBoard = e => history.push('/jobboard')

    const renderTimePicker = (
        <FormControl variant='outlined' required className={classes.datePicker}>
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
        <FormWrapper
            onSubmit={handleSubmit}
            title='Create Job'
            onBack={redirectToJobBoard}
        >
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
            <Slots slots={shift.slots} onRemove={onSlotRemove} />
            <div className={`${classes.row} ${classes.space}`}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        className={classes.datePicker}
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
                    <Button
                        onClick={onAddSlot}
                        variant='contained'
                        aria-label='add'
                        color='secondary'
                        style={{ margin: 5 }}
                    >
                        Add
                    </Button>
                )}
            </div>
            <div className={`${classes.row} ${classes.space}`}>
                <InputLabel>Location:</InputLabel>
                <Button
                    variant='contained'
                    color='secondary'
                    className={classes.button}
                    startIcon={<MyLocationIcon />}
                    onClick={useCurrentLocation}
                >
                    Get current location
                </Button>
                <Button
                    onClick={useSavedLocation}
                    variant='contained'
                    color='secondary'
                    className={classes.button}
                    startIcon={<LocationOnIcon />}
                >
                    Use Saved location
                </Button>
            </div>
            {!!shift.latitude && !!shift.longitude && (
                <div style={{ margin: '20px 0' }}>
                    <Maps
                        isMarkerShown
                        markerPosition={{
                            lat: shift.latitude,
                            lng: shift.longitude,
                        }}
                    />
                </div>
            )}
            <FormControl
                required
                variant='outlined'
                className={`${classes.formControl} ${classes.space}`}
            >
                <InputLabel id='sites'>Sites</InputLabel>
                <Select
                    labelId='sites'
                    id='site'
                    name='site'
                    value={shift.site}
                    onChange={handleChange}
                    label='Sites'
                >
                    {sites &&
                        sites.map(site => (
                            <MenuItem value={site.siteName}>{site.siteName}</MenuItem>
                        ))}
                </Select>
            </FormControl>
            <FormControl required variant='outlined' className={classes.formControl}>
                <InputLabel id='deps'>Departments</InputLabel>
                <Select
                    labelId='deps'
                    id='dep'
                    name='dep'
                    value={shift.dep}
                    onChange={handleChange}
                    label='Departments'
                >
                    {deps &&
                        deps.map(dep => (
                            <MenuItem value={dep.depName}>{dep.depName}</MenuItem>
                        ))}
                </Select>
            </FormControl>
            <TextField
                required
                type='number'
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
                submit
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
