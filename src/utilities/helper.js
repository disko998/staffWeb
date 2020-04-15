export const formatDate = d => {
    var month = '' + (d.getMonth() + 1)
    var day = '' + d.getDate()
    var year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
}

export const calculateJobsLength = jobs => {
    if (jobs) {
        jobs = jobs.map(j => j.d)
        let vacant = jobs.filter(
            job => job.type === 'Vacant' && new Date(job.date) >= new Date(),
        )
        let filled = jobs.filter(job => job.type === 'Filled')
        let unfilled = jobs.filter(
            job => job.type === 'Vacant' && new Date(job.date) < new Date(),
        )

        return {
            vacantSize: vacant.length,
            filledSize: filled.length,
            unfilledSize: unfilled.length,
        }
    }

    return {
        vacantSize: 0,
        filledSize: 0,
        unfilledSize: 0,
    }
}
