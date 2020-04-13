import React from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { NavLink } from 'react-router-dom'

import { useSignedOutStyles } from './Styles'

const SignedOutLinks = () => {
    const classes = useSignedOutStyles()
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
