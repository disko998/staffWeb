import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'

import DataTable from '../layout/DataTable'

function Sites({ sites, auth, firestore }) {
    if (!auth.uid) return <Redirect to='/signin' />

    const { addToast } = useToasts()
    const [state, setState] = useState({
        columns: [
            { title: 'Site Number', field: 'siteNo', type: 'numeric' },
            { title: 'Site Name', field: 'siteName' },
            { title: 'Site Address', field: 'siteAdd' },
            { title: 'Site Manager', field: 'siteManager' },
            { title: 'Site Telephone', field: 'siteTel', type: 'numeric' },
        ],
        data: [],
    })

    useEffect(() => {
        setState({ ...state, data: sites })
    }, [sites])

    const onDelete = site => {
        firestore.delete({ collection: 'sites', doc: site.id })
        addToast('Site has been deleted', {
            appearance: 'warning',
            autoDismiss: true,
        })
    }
    const onUpdate = site => {
        firestore.update({ collection: 'sites', doc: site.id }, site)
        addToast('Successfully update site', {
            appearance: 'info',
            autoDismiss: true,
        })
    }
    const onAdd = site => {
        firestore.add({ collection: 'sites' }, { ...site, uid: auth.uid })
        addToast('New site was added to a list', {
            appearance: 'success',
            autoDismiss: true,
        })
    }

    return (
        <DataTable
            onRowDelete={onDelete}
            onRowUpdate={onUpdate}
            onRowAdd={onAdd}
            title='Sites'
            columns={state.columns}
            data={state.data}
        />
    )
}

const mapStateToProps = state => ({
    sites: state.firestore.ordered.sites,
    auth: state.firebase.auth,
})

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => [
        {
            collection: 'sites',
            where: ['uid', '==', props.auth.uid],
        },
    ]),
)(Sites)
