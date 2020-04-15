import { makeStyles } from '@material-ui/core'

export const useCreateJobStyle = makeStyles(theme => ({
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
            margin: '5px 15px',
        },
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    formControl: {
        minWidth: 150,
    },
    datePicker: {
        minWidth: 200,
        margin: 10,
    },
}))

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

export const useJobBoardStyle = makeStyles(theme => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    button: {
        background: 'green',
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    vacant: {
        background: '#2196f3',
        '&:hover': {
            background: '#1976d2',
        },
    },
    filled: {
        background: '#4caf50',
        '&:hover': {
            background: '#388e3c',
        },
    },
    unfilled: {
        background: '#f44336',
        '&:hover': {
            background: '#d32f2f',
        },
    },
}))
