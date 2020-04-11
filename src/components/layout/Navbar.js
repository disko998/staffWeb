import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import UserSignedInLinks from './UserSignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import SuperAdminLinks from './SuperAdminLinks'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import { Container, Typography, Toolbar, AppBar } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        color: '#fff',
    },
    link: {
        flexGrow: 1,
    },
}))

const Navbar = ({ auth, profile }) => {
    const classes = useStyles()

    let links = null
    if (auth.uid) {
        if (profile.superAdmin) {
            links = <SuperAdminLinks profile={profile} />
        } else if (profile.isAdmin) {
            links = <SignedInLinks profile={profile} />
        } else {
            links = <UserSignedInLinks profile={profile} />
        }
    } else {
        links = <SignedOutLinks />
    }

    return (
        <div className={classes.root}>
            <AppBar position='static'>
                <Container maxWidth='md'>
                    <Toolbar>
                        <Link to='/' className='brand-logo' className={classes.link}>
                            <Typography variant='h4' className={classes.title}>
                                {profile.accountName ? profile.accountName : 'Staffa'}
                            </Typography>
                        </Link>
                        {links}
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
})

export default connect(mapStateToProps)(Navbar)
