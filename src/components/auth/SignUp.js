import React, { useState, useEffect } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { useToasts } from 'react-toast-notifications'
import {
    Card,
    Grid,
    Typography,
    TextField,
    Button,
    FormControl,
    RadioGroup,
    Radio,
    FormControlLabel,
    FormLabel,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core'

import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import LockOpenIcon from '@material-ui/icons/LockOpen'

import { signUp } from '../../store/actions/authActions'
import { useStyle } from './Styles'

const SignUp = ({ auth, authError, signUp, history }) => {
    const { addToast } = useToasts()
    const classes = useStyle()
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isSingleSite: 'true',
        isSingleDep: 'true',
        accountName: '',
        orgType: '',
        type: 'agency',
        latitude: '',
        longitude: '',
    })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position =>
                setUserData({
                    ...userData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }),
            err => alert('Please share your location'),
        )
    }, [])

    const handleChange = e => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        signUp(userData)
    }

    const redirectToSignIn = e => history.push('/signin')

    if (auth.uid) return <Redirect to='/' />

    return (
        <Grid xs={12} md={10} className={classes.formWrapper}>
            <Card elevation={2}>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Typography className={classes.title} variant='h4'>
                        Sign Up
                    </Typography>
                    <TextField
                        required
                        label='Email'
                        name='email'
                        onChange={handleChange}
                        className={classes.input}
                    />
                    <TextField
                        type='password'
                        required
                        label='Password'
                        name='password'
                        onChange={handleChange}
                        className={classes.input}
                    />
                    <TextField
                        required
                        label='First Name'
                        name='firstName'
                        onChange={handleChange}
                        className={classes.input}
                    />
                    <TextField
                        required
                        label='Last Name'
                        name='lastName'
                        onChange={handleChange}
                        className={classes.input}
                    />
                    <TextField
                        required
                        label='Account Name'
                        name='accountName'
                        onChange={handleChange}
                        className={classes.input}
                    />
                    <FormControl required component='fieldset' className={classes.input}>
                        <FormLabel component='legend'>Site</FormLabel>
                        <RadioGroup
                            row
                            aria-label='isSingleSite'
                            name='isSingleSite'
                            value={userData.isSingleSite}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value={'true'}
                                control={<Radio />}
                                label='Single Site'
                            />
                            <FormControlLabel
                                value={'false'}
                                control={<Radio />}
                                label='Multi Site'
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl required component='fieldset' className={classes.input}>
                        <FormLabel component='legend'>Department</FormLabel>
                        <RadioGroup
                            row
                            aria-label='isSingleDep'
                            name='isSingleDep'
                            value={userData.isSingleDep}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value='true'
                                control={<Radio />}
                                label='Single Department'
                            />
                            <FormControlLabel
                                value='false'
                                control={<Radio />}
                                label='Multi Department'
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl required className={classes.input}>
                        <InputLabel id='demo-simple-select-label'>
                            Please select your orgnazation type
                        </InputLabel>
                        <Select
                            required
                            labelId='organization type'
                            name='orgType'
                            value={userData.orgType}
                            onChange={handleChange}
                        >
                            <MenuItem value='hospital'>Hospital</MenuItem>
                            <MenuItem value='clinic'>Clinic</MenuItem>
                            <MenuItem value='careHome'>Care Home</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type='submit'
                        variant='contained'
                        size='large'
                        color='primary'
                        className={classes.input}
                        startIcon={<AssignmentIndIcon />}
                    >
                        Register
                    </Button>
                    <Button
                        type='button'
                        className={classes.input}
                        variant='outlined'
                        size='large'
                        color='secondary'
                        startIcon={<LockOpenIcon />}
                        onClick={redirectToSignIn}
                    >
                        Sign in
                    </Button>
                    {authError &&
                        addToast(authError, {
                            appearance: 'error',
                            autoDismiss: true,
                        })}
                </form>
            </Card>
        </Grid>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        authError: state.auth.authError,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signUp: creds => dispatch(signUp(creds)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp))
