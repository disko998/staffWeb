import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Typography, Toolbar, AppBar, IconButton } from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import MenuIcon from '@material-ui/icons/Menu'

import SignedOutLinks from './SignedOutLinks'
import DrawerMenu from './DrawerMenu'
import { useStylesNavbar } from './Styles'

const Navbar = ({ auth, profile }) => {
    const classes = useStylesNavbar()
    const [openDrawer, setOpenDrawer] = React.useState(false)

    const menuButton = (
        <IconButton
            size='medium'
            aria-label='menu'
            className={classes.menuButton}
            onClick={() => setOpenDrawer(true)}
        >
            {!openDrawer ? <MenuIcon /> : <CloseIcon />}
        </IconButton>
    )

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
                        {auth.uid ? menuButton : <SignedOutLinks />}
                    </Toolbar>
                </Container>
            </AppBar>
            <DrawerMenu
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onOpen={() => setOpenDrawer(true)}
            />
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
})

export default connect(mapStateToProps)(Navbar)
