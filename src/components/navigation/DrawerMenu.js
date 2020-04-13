import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
    ListSubheader,
    ListItemText,
    ListItemIcon,
    ListItem,
    Divider,
    List,
    Drawer,
} from '@material-ui/core'

import AssignmentIcon from '@material-ui/icons/Assignment'
import PeopleIcon from '@material-ui/icons/People'
import PlaceIcon from '@material-ui/icons/Place'
import GroupWorkIcon from '@material-ui/icons/GroupWork'
import MessageIcon from '@material-ui/icons/Message'
import SettingsIcon from '@material-ui/icons/Settings'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AddAlarmIcon from '@material-ui/icons/AddAlarm'
import LocalAtmIcon from '@material-ui/icons/LocalAtm'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'

import { signOut } from '../../store/actions/authActions'
import { useStylesDrawer } from './Styles'

function DrawerMenu({ open, onClose, onOpen, history, signOut, auth, profile }) {
    const classes = useStylesDrawer()

    const adminLinks = [
        { path: '/jobboard', label: 'Jobs Board', icon: <AssignmentIcon /> },
        { path: '/createjob', label: 'Post Shift', icon: <AddAlarmIcon /> },
        { path: '/users', label: 'Users', icon: <PeopleIcon /> },
        { path: '/sites', label: 'Sites', icon: <PlaceIcon /> },
        { path: '/deps', label: 'Departments', icon: <GroupWorkIcon /> },
        { path: '/messages', label: 'Messages', icon: <MessageIcon /> },
    ]

    const superAdmin = [
        { path: '/tax', label: 'Tax', icon: <LocalAtmIcon /> },
        { path: '/fees', label: 'Fees', icon: <LocalOfferIcon /> },
        { path: '/messages', label: 'Messages', icon: <MessageIcon /> },
    ]

    const commonLinks = [
        { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
        {
            path: '/signin',
            label: 'Logout',
            icon: <ExitToAppIcon />,
            onClick: signOut,
        },
    ]

    const onItemPress = route => {
        history.push(route)
        onClose()
    }

    return (
        <Drawer anchor='right' open={open} onClose={onClose} onOpen={onOpen}>
            <div>
                {profile.isAdmin && (
                    <List className={classes.list}>
                        <ListSubheader component='div'>Admin Panel</ListSubheader>
                        {adminLinks.map((link, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => onItemPress(link.path)}
                            >
                                <ListItemIcon>{link.icon}</ListItemIcon>
                                <ListItemText primary={link.label} />
                            </ListItem>
                        ))}
                    </List>
                )}
                <Divider />
                {profile.superAdmin && (
                    <List className={classes.list}>
                        <ListSubheader component='div'>Super Admin Panel</ListSubheader>
                        {superAdmin.map((link, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => onItemPress(link.path)}
                            >
                                <ListItemIcon>{link.icon}</ListItemIcon>
                                <ListItemText primary={link.label} />
                            </ListItem>
                        ))}
                    </List>
                )}
                <Divider />
                <List>
                    <ListSubheader component='div'>
                        Signed in as{' '}
                        <strong>{`${profile.firstName} ${profile.lastName}`}</strong>
                    </ListSubheader>
                    {commonLinks.map(({ path, icon, label, onClick }, index) => (
                        <ListItem
                            button
                            key={index}
                            onClick={() => (onClick ? onClick(path) : onItemPress(path))}
                        >
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>
    )
}

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
})

const mapDispatchToProps = dispatch => ({
    signOut: () => dispatch(signOut()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DrawerMenu))
