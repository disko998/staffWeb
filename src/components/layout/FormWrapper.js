import React from 'react'
import { Grid, Card, Typography, IconButton, Box } from '@material-ui/core'

import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import { useAddDepStyle } from './Styles'

const FormWrapper = ({ children, onSubmit, title, onBack }) => {
    const classes = useAddDepStyle()

    return (
        <Grid xs={12} md={10} className={classes.grid}>
            <Card elevation={2} className={classes.formWrapper}>
                <Box className={classes.headerWrapper}>
                    {onBack && (
                        <IconButton
                            aria-label='back'
                            onClick={onBack}
                            className={classes.backButton}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Typography className={classes.title} variant='h4'>
                        {title}
                    </Typography>
                </Box>
                <form className={classes.form} onSubmit={onSubmit}>
                    {children}
                </form>
            </Card>
        </Grid>
    )
}

export default FormWrapper
