import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'

import DataTable from '../layout/DataTable'

function Deps({ deps, auth, firestore }) {
    if (!auth.uid) return <Redirect to='/signin' />

    const { addToast } = useToasts()
    const [state, setState] = React.useState({
        columns: [
            { title: 'Dep Number', field: 'depNo', type: 'numeric' },
            { title: 'Dep Name', field: 'depName' },
            { title: 'Dep Site', field: 'depSite' },
            { title: 'Dep Manager', field: 'depManager' },
            { title: 'Dep Telephone', field: 'depTel', type: 'numeric' },
        ],
        data: [],
    })

    useEffect(() => {
        setState({ ...state, data: deps })
    }, [deps])

    const onDeleteDep = dep => {
        firestore.delete({ collection: 'deps', doc: dep.id })
        addToast('Department has been deleted', {
            appearance: 'warning',
            autoDismiss: true,
        })
    }
    const onUpdateDep = dep => {
        firestore.update({ collection: 'deps', doc: dep.id }, dep)
        addToast('Successfully update department', {
            appearance: 'info',
            autoDismiss: true,
        })
    }
    const onAddDep = dep => {
        firestore.add({ collection: 'deps' }, { ...dep, uid: auth.uid })
        addToast('New site was added to a list', {
            appearance: 'success',
            autoDismiss: true,
        })
    }

    return (
        <DataTable
            onRowDelete={onDeleteDep}
            onRowUpdate={onUpdateDep}
            onRowAdd={onAddDep}
            title='Departments'
            columns={state.columns}
            data={state.data}
        />
    )
}

const mapStateToProps = state => ({
    deps: state.firestore.ordered.deps,
    auth: state.firebase.auth,
})

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => [
        {
            collection: 'deps',
            where: ['uid', '==', props.auth.uid],
        },
    ]),
)(Deps)
