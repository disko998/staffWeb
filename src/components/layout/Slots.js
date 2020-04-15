import React from 'react'
import { Chip, Typography, IconButton } from '@material-ui/core'

import RemoveIcon from '@material-ui/icons/Remove'

import { useSlotsStyle } from './Styles'

export default function Slots({ slots, onRemove, ...otherProps }) {
    const classes = useSlotsStyle()
    const slotKeys = Object.keys(slots)

    return (
        !!slotKeys.length && (
            <div {...otherProps}>
                {slotKeys.map(date => {
                    return (
                        <div className={classes.wrapper}>
                            <Typography variant='subtitle2'>{date}</Typography>
                            <div className={classes.slotContainer}>
                                {slots[date].map(slot => (
                                    <Chip label={slot} />
                                ))}
                                <IconButton
                                    onClick={() => onRemove(date)}
                                    style={{ color: '#000' }}
                                >
                                    <RemoveIcon fontSize='default' />
                                </IconButton>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    )
}
