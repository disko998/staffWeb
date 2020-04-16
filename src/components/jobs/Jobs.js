import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'

import {
    getChatUID,
    isTopicExist,
    addNewTopicNode,
    setNewConversation,
    getUserData,
} from '../../store/messageApi/messagesApi'
import { getBidsForJobId } from '../../store/bidApi/bidApi'
import firebase from '../../config/fbConfig'
import JobsTable from './JobsTable'
import BidsTable from './BidsTable'

const mockJobs = [
    {
        id: 'ddasdasd231ad21d1212',
        name: 'Filled',
        site: 'Site',
        dep: 'Department',
        jobNo: 555,
        cost: 1200,
        date: new Date(),
        type: 'Filled',
        ward: 'Ward',
        manager: 'Manager',
    },
    {
        id: 'dad21d1212',
        name: 'Vacant',
        site: 'Site',
        dep: 'Department',
        jobNo: 333,
        cost: 1500,
        date: new Date(new Date().setDate(new Date().getDate() + 6)),
        type: 'Vacant',
        ward: 'Ward',
        manager: 'Manager',
    },
    {
        id: 'dad21d1212',
        name: 'Unfilled',
        site: 'Site',
        dep: 'Department',
        jobNo: 888,
        cost: 1000,
        date: new Date(new Date().setDate(new Date().getDate() - 6)),
        type: 'Vacant',
        ward: 'Ward',
        manager: 'Manager',
    },
]

export class Jobs extends Component {
    state = {
        showBids: false,
        bids: [],
        currentJob: '',
    }

    onShowBids = job => () => {
        getBidsForJobId(job.id, (err, data) => {
            this.setState({ bids: data, currentJob: job })
            this.props.onShowBids()
        })
    }

    onShowJobs = () => {
        this.setState({ bids: [], currentJob: '' })
        this.props.onShowJobs()
    }

    onMessage = bid => () => {
        getUserData(bid.uid, (error, response) => {
            var chatUID = getChatUID(
                bid.uid,
                this.props.auth.uid,
                this.state.currentJob.name,
            )
            response.id = bid.uid
            isTopicExist(chatUID, exists => {
                if (exists) {
                    this.props.history.push({
                        pathname: '/messages',
                        state: {
                            freelancer: response,
                            topicName: this.state.currentJob.name,
                        },
                    })
                } else {
                    addNewTopicNode(this.state.currentJob.name, chatUID)
                    setNewConversation(
                        this.props.auth.uid,
                        bid.uid,
                        chatUID,
                        this.state.currentJob.name,
                    )
                    this.props.history.push({
                        pathname: '/messages',
                        state: {
                            freelancer: response,
                            topicName: this.state.currentJob.name,
                        },
                    })
                }
            })
        })
    }

    formatDate = d => {
        var month = '' + (d.getMonth() + 1)
        var day = '' + d.getDate()
        var year = d.getFullYear()

        if (month.length < 2) {
            month = '0' + month
        }

        if (day.length < 2) {
            day = '0' + day
        }

        return [year, month, day].join('-')
    }

    onApprovePayment = bid => () => {
        const jobData = {
            ...this.state.currentJob,
            coordinates: new firebase.firestore.GeoPoint(
                this.state.currentJob.coordinates._lat,
                this.state.currentJob.coordinates._long,
            ),
            type: 'Filled',
            completed: true,
        }
        this.props.firestore.update(
            { collection: 'jobs', doc: this.state.currentJob.id },
            { d: jobData },
        )
        alert('The payment has been approved')

        let paymentData = {
            amount: bid.price * bid.times.length,
            freelancerName: bid.freelancerName,
            agencyName: `${this.props.profile.firstName} ${this.props.profile.lastName}`,
            date: this.formatDate(new Date()),
            status: 'PENDING',
            freelancerId: bid.uid,
            agencyId: this.props.auth.uid,
            jobName: this.state.currentJob.name,
        }

        this.props.firestore.add({ collection: 'payments' }, paymentData)
        this.props.handleClick('Filled')
    }

    onHire = bid => () => {
        const jobData = {
            ...this.state.currentJob,
            coordinates: new firebase.firestore.GeoPoint(
                this.state.currentJob.coordinates._lat,
                this.state.currentJob.coordinates._long,
            ),
            type: 'Filled',
        }
        const bidData = {
            ...bid,
            approved: true,
        }
        this.props.firestore.update(
            { collection: 'jobs', doc: this.state.currentJob.id },
            { d: jobData },
        )
        this.props.firestore.update({ collection: 'Bids', doc: bid.id }, bidData)
        this.props.handleClick('Filled')
    }

    render() {
        let { auth, jobs, selectedTable } = this.props

        if (!auth.uid) return <Redirect to='/signin' />

        if (jobs) {
            jobs = [...jobs, ...mockJobs]
            jobs = jobs
                .map(j => {
                    return {
                        ...j.d,
                        id: j.id,
                    }
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date))
        }

        if (jobs && !this.props.showBids) {
            return (
                <JobsTable
                    jobs={mockJobs}
                    selectedTable={selectedTable}
                    onShowBids={this.onShowBids}
                />
            )
        }

        if (this.props.showBids) {
            return (
                <BidsTable
                    bids={
                        this.state.currentJob.type === 'Vacant'
                            ? this.state.bids
                            : this.state.bids.filter(b => b.approved)
                    }
                    onShowJobs={this.onShowJobs}
                    onMessage={this.onMessage}
                    onHire={this.onHire}
                    currentJob={this.state.currentJob}
                    onApprovePayment={this.onApprovePayment}
                />
            )
        }

        return null
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        jobs: state.firestore.ordered.jobs,
        auth: state.firebase.auth,
        profile: state.firebase.profile,
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => [
        {
            collection: 'jobs',
            where: ['d.uid', '==', props.auth.uid],
        },
    ]),
)(Jobs)
