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
