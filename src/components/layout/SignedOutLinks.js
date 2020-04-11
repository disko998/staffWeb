import React from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { makeStyles } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    link: {
        color: '#fff',
        '&:hover': {
            color: '#fff',
        },
    },
}))

const SignedOutLinks = () => {
    const classes = useStyles()
    return (
        <ButtonGroup variant='text' aria-label='text primary button group'>
            <Button>
                <NavLink className={classes.link} to='/signin'>
                    Sign in
                </NavLink>
            </Button>
            <Button>
                <NavLink className={classes.link} to='/signup'>
                    Sign up
                </NavLink>
            </Button>
        </ButtonGroup>
    )
}

export default SignedOutLinks
