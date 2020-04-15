import { makeStyles } from '@material-ui/core'

export const useAddDepStyle = makeStyles(theme => ({
    grid: {
        margin: 'auto',
    },
    formWrapper: {
        padding: 15,
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
    spacing: {
        margin: '15px 0',
    },
    backButton: {
        position: 'absolute',
        top: '50%',
        left: 15,
        color: '#000',
        transform: 'translateY(-50%)',
    },
    headerWrapper: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: '15px !important',
        marginBottom: '15px !important',
    },
}))

export const useSlotsStyle = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        '& > *': {
            margin: 5,
        },
    },
    slotContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        '& > *': {
            margin: 2,
        },
    },
}))
