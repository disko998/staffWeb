import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import { Grid, Typography, TextField, Button, Card } from '@material-ui/core'

import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import LockOpenIcon from '@material-ui/icons/LockOpen'

import { signIn } from '../../store/actions/authActions'
import { useStyle } from './Styles'

const SignIn = ({ authError, auth, signIn, history }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const classes = useStyle()

    const handleChange = e => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value,
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        signIn(credentials)
    }
    const redirectToSignUp = e => {
        history.push('/signup')
    }

    if (auth.uid) return <Redirect to='/' />

    return (
        <Grid xs={10} md={6} className={classes.formWrapper}>
            <Card elevation={2}>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Typography className={classes.title} variant='h4'>
                        Sign In
                    </Typography>
                    <TextField
                        error={authError}
                        required
                        label='Email'
                        id='email'
                        onChange={handleChange}
                        className={classes.input}
                    />
                    <TextField
                        error={authError}
                        type='password'
                        required
                        label='Password'
                        id='password'
                        onChange={handleChange}
                        className={classes.input}
                    />
                    <Button
                        type='submit'
                        className={classes.input}
                        variant='contained'
                        size='large'
                        color='primary'
                        startIcon={<LockOpenIcon />}
                    >
                        Login
                    </Button>
                    <Button
                        type='button'
                        className={classes.input}
                        variant='outlined'
                        size='large'
                        color='secondary'
                        startIcon={<AssignmentIndIcon />}
                        onClick={redirectToSignUp}
                    >
                        Sign up
                    </Button>
                    {authError && <div className={classes.error}>{authError}</div>}
                </form>
            </Card>
        </Grid>
    )
}

const mapStateToProps = state => {
    return {
        authError: state.auth.authError,
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signIn: creds => dispatch(signIn(creds)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn))
