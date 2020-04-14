import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'

import DataTable from '../layout/DataTable'

function Sites({ sites, auth, firestore }) {
    if (!auth.uid) return <Redirect to='/signin' />

    const [state, setState] = React.useState({
        columns: [
            { title: 'Site Number', field: 'siteNo', type: 'numeric' },
            { title: 'Site Name', field: 'siteName' },
            { title: 'Site Address', field: 'siteAdd' },
            { title: 'Site Manager', field: 'siteManager' },
            { title: 'Site Telephone', field: 'siteTel', type: 'numeric' },
        ],
        data: [],
    })
    console.log(sites)

    useEffect(() => {
        setState({ ...state, data: sites })
    }, [sites])

    console.log(firestore)

    const onDelete = site => {
        firestore.delete({ collection: 'sites', doc: site.id })
    }
    const onUpdate = site => {
        firestore.update({ collection: 'sites', doc: site.id }, site)
    }
    const onAdd = site => {
        firestore.add({ collection: 'sites' }, { ...site, uid: auth.uid })
    }

    return (
        <DataTable
            onRowDelete={onDelete}
            onRowUpdate={onUpdate}
            onRowAdd={onAdd}
            title='Departments'
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
