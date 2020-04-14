import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { TextField, Button } from '@material-ui/core'
import { useToasts } from 'react-toast-notifications'

import SaveIcon from '@material-ui/icons/Save'

import FormWrapper from '../layout/FormWrapper'
import { useAddDepStyle } from './Styles'

export const AddDep = ({ auth, firestore, history }) => {
    if (!auth.uid) return <Redirect to='/signin' />

    const { addToast } = useToasts()
    const classes = useAddDepStyle()
    const [newDep, setNewDep] = useState({
        depName: '',
        depNo: '',
        depSite: '',
        depManager: '',
        depTel: '',
    })

    const onSubmit = e => {
        e.preventDefault()

        // Adding department to a collection
        firestore.add(
            { collection: 'deps' },
            {
                ...newDep,
                uid: auth.uid,
            },
        )

        addToast('Added new department.', {
            appearance: 'info',
            autoDismiss: true,
        })

        // redirect to view
        history.push('/deps/')
    }
    const handleChange = e => {
        setNewDep({
            [e.target.id]: e.target.value,
        })
    }

    return (
        <FormWrapper onSubmit={onSubmit} title='Add Department' onBack={history.goBack}>
            <TextField
                required
                label='Department Number'
                name='depNo'
                id='depNo'
                type='number'
                onChange={handleChange}
                className={classes.spacing}
            />
            <TextField
                type='text'
                required
                label='Department Name'
                name='depName'
                id='depName'
                onChange={handleChange}
                className={classes.spacing}
            />
            <TextField
                required
                label='Department Site'
                name='depSite'
                id='depSite'
                type='text'
                onChange={handleChange}
                className={classes.spacing}
            />
            <TextField
                type='text'
                required
                label='Department Manager'
                name='depManager'
                id='depManager'
                onChange={handleChange}
                className={classes.spacing}
            />
            <TextField
                required
                label='Department Telephone'
                id='depTel'
                name='depTel'
                type='tel'
                onChange={handleChange}
                className={classes.spacing}
            />
            <Button
                type='submit'
                variant='contained'
                size='large'
                color='primary'
                className={classes.spacing}
                startIcon={<SaveIcon />}
            >
                Save
            </Button>
        </FormWrapper>
    )
}

const mapStateToProps = state => ({
    auth: state.firebase.auth,
})

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {
            collection: 'deps',
        },
    ]),
)(AddDep)
