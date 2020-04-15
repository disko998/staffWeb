import { makeStyles } from '@material-ui/core'

export const useStyle = makeStyles(theme => ({
    space: {
        margin: '15px 0',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        '& > *': {
            margin: '5px 10px',
        },
    },
}))
