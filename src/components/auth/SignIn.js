import React, { useState } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'
import { makeStyles, Grid, Typography, TextField, Button, Card } from '@material-ui/core'
import LockOpenIcon from '@material-ui/icons/LockOpen'

const useStyle = makeStyles(theme => ({
    formWrapper: {
        margin: 'auto',
        marginTop: 60,
    },
    form: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        margin: 0,
    },
    title: {
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    input: {
        margin: '15px 0',
    },
    error: {
        margin: '15px 0',
        color: 'red',
        textAlign: 'center',
    },
}))

const SignIn = ({ authError, auth, signIn }) => {
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
                        className={classes.input}
                        startIcon={<LockOpenIcon />}
                        onClick={handleSubmit}
                    >
                        Login
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
