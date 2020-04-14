import React from 'react'
import MaterialTable from 'material-table'

export default function DataTable({
    title,
    columns,
    data,
    onRowAdd,
    onRowDelete,
    onRowUpdate,
}) {
    return (
        <MaterialTable
            title={title}
            columns={columns}
            data={data}
            editable={{
                onRowAdd: newData =>
                    new Promise(resolve => {
                        resolve()
                        onRowAdd(newData)
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(resolve => {
                        resolve()
                        if (oldData) {
                            onRowUpdate(newData)
                        }
                    }),
                onRowDelete: oldData =>
                    new Promise(resolve => {
                        resolve()
                        onRowDelete(oldData)
                    }),
            }}
        />
    )
}
