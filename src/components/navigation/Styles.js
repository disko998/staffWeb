import { makeStyles } from '@material-ui/core'

export const useStylesNavbar = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
    },
    menuButton: {
        color: '#fff',
    },
    title: {
        color: '#fff',
    },
    link: {
        flexGrow: 1,
    },
}))

export const useStylesDrawer = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    link: {
        color: 'rgba(0,0,0,0.8)',
        '&:hover': {
            color: 'rgba(0,0,0,0.8)',
        },
    },
})

export const useSignedOutStyles = makeStyles(theme => ({
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
