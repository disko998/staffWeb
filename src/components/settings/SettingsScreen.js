import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { TextField, Button } from '@material-ui/core'
import { useToasts } from 'react-toast-notifications'

import { signUp } from '../../store/actions/authActions'
import { updateProfile, updateBudget } from '../../store/bidApi/bidApi'
import { FormWrapper } from '../layout'
import { useStyle } from './Styles'

const stripe = window.Stripe('pk_test_POOtIVB0yOmKQynAjn7VoOEK')

const SettingsScreen = ({ profile, auth, history }) => {
    if (!auth.uid) return <Redirect to='/signin' />

    const { addToast } = useToasts()
    const classes = useStyle()
    const [userSettings, setUserSettings] = useState({
        email: '',
        firstName: '',
        lastName: '',
        accountName: '',
        latitude: '',
        longitude: '',
        location: '',
        uid: '',
        budget: '0',
    })
    const {
        email,
        firstName,
        lastName,
        accountName,
        latitude,
        longitude,
        location,
        uid,
        budget,
        fund,
    } = userSettings

    useEffect(() => {
        // Init state ith user data
        setUserSettings({
            email: profile.email || '',
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            accountName: profile.accountName || '',
            latitude: profile.latitude || '',
            longitude: profile.longitude || '',
            location:
                !!profile.latitude && profile.longitude
                    ? `${profile.latitude}, ${profile.longitude}`
                    : '',
            uid: auth.uid,
            budget: profile.budget || '0',
        })

        // Found Account
        if (window.location.href.includes('response')) {
            let settingsData = localStorage.getItem('settingsData')

            if (!!settingsData) {
                settingsData = JSON.parse(settingsData)
                setUserSettings(settingsData)

                localStorage.removeItem('settingsData')

                if (window.location.href.includes('success')) {
                    alert('Your account has been funded')
                    setUserSettings({ fund: '' })
                    updateBudget({
                        uid: settingsData.uid,
                        budget: Number(settingsData.budget) + Number(settingsData.fund),
                    })
                } else {
                    alert('Payment failed. Please try again')
                }
            }
        }
    }, [profile, auth])

    const handleChange = e => {
        setUserSettings({
            ...userSettings,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        updateProfile(userSettings)
    }

    const useCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position =>
                setUserSettings({
                    ...userSettings,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }),
            addToast('Location was found, please save settings!', {
                appearance: 'info',
                autoDismiss: true,
            }),
            err =>
                addToast('Please share your location', {
                    appearance: 'warning',
                    autoDismiss: true,
                }),
        )
    }

    const addFunds = e => {
        e.preventDefault()

        const orderData = {
            name: firstName,
            amount: Number(fund),
            customerId: profile.stripe_id,
            customer_email: email,
        }

        // Call Firebase function for checkout
        fetch(
            'https://us-central1-staffa-13e8a.cloudfunctions.net/createCheckoutSession/',
            {
                method: 'POST',
                body: JSON.stringify(orderData),
            },
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                localStorage.setItem('settingsData', JSON.stringify(userSettings))

                // Redirecting to payment form page
                stripe
                    .redirectToCheckout({
                        sessionId: data.sessionId,
                    })
                    .then(function (result) {
                        result.error.message
                    })
            })
    }

    const redirectToJobBoard = e => history.push('/jobboard')

    return (
        <FormWrapper onSubmit={handleSubmit} title='Settings' onBack={redirectToJobBoard}>
            <TextField
                required
                type='email'
                label='Email'
                disabled
                id='email'
                name='email'
                value={email}
                onChange={handleChange}
                className={classes.space}
            />
            <TextField
                required
                type='text'
                label='First Name'
                id='firstName'
                name='firstName'
                value={firstName}
                onChange={handleChange}
                className={classes.space}
            />
            <TextField
                required
                type='text'
                label='Last Name'
                id='lastName'
                name='lastName'
                value={lastName}
                onChange={handleChange}
                className={classes.space}
            />
            <TextField
                required
                type='text'
                label='Account Name'
                id='accountName'
                name='accountName'
                value={accountName}
                onChange={handleChange}
                className={classes.space}
            />
            <TextField
                required
                type='number'
                label='Current Budget'
                id='budget'
                name='budget'
                value={budget}
                onChange={handleChange}
                className={classes.space}
            />
            <TextField
                required
                type='text'
                label='Default Location'
                id='location'
                name='location'
                value={location}
                disabled
                onChange={handleChange}
                className={classes.space}
            />
            <TextField
                type='number'
                label='Found Amount'
                id='fund'
                name='fund'
                onChange={handleChange}
                className={classes.space}
            />
            <div className={`${classes.row} ${classes.space}`}>
                <Button type='submit' variant='contained' color='primary'>
                    Update settings
                </Button>
                <Button onClick={useCurrentLocation} variant='contained' color='primary'>
                    Set current location
                </Button>
                {profile.isAdmin && fund && (
                    <Button onClick={addFunds} variant='contained' color='primary'>
                        Add founds
                    </Button>
                )}
            </div>
        </FormWrapper>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signUp: creds => dispatch(signUp(creds)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
