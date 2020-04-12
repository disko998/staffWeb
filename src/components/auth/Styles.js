import { makeStyles } from '@material-ui/core'

export const useStyle = makeStyles(theme => ({
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
