import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'

import Strings from '../../utilities/Strings'
import DataTable from '../layout/DataTable'

function Users({ users, auth, firestore, authError }) {
    if (!auth.uid) return <Redirect to='/signin' />

    const { addToast } = useToasts()
    const [state, setState] = useState({
        columns: [
            { title: 'First Name', field: 'firstName' },
            { title: 'Last Name', field: 'lastName' },
            { title: 'Email', field: 'email' },
            { title: 'Password', field: 'password' },
        ],
        data: [],
    })

    useEffect(() => {
        setState({ ...state, data: users })
    }, [users])

    const onDelete = user => {
        firestore.delete({ collection: 'users', doc: user.id })
        addToast('User has been deleted', {
            appearance: 'warning',
            autoDismiss: true,
        })
    }
    const onUpdate = user => {
        firestore.update({ collection: 'users', doc: user.id }, user)
        addToast('Successfully update user', {
            appearance: 'info',
            autoDismiss: true,
        })
    }
    const onAdd = user => {
        firestore.add(
            { collection: 'users' },
            {
                ...user,
                isSingleSite: 'true',
                isSingleDep: 'true',
                accountName: `${user.email.split('@')[0]}`,
                orgType: '',
                uid: auth.uid,
            },
        )

        addToast('New user was added to a list', {
            appearance: 'success',
            autoDismiss: true,
        })
    }

    return (
        <React.Fragment>
            <DataTable
                onRowDelete={onDelete}
                onRowUpdate={onUpdate}
                onRowAdd={onAdd}
                title='Users'
                columns={state.columns}
                data={state.data}
            />
            {authError ? <p>{authError}</p> : null}
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    users: state.firestore.ordered.Users,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    authError: state.user.authError2,
    deps: state.firestore.ordered.deps,
    sites: state.firestore.ordered.sites,
})

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => [
        {
            collection: Strings.FS_COLLECTION_USERS,
            where: ['uid', '==', props.auth.uid],
        },
    ]),
)(Users)
