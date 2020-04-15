import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";
import { getBidsForJobId } from '../../store/bidApi/bidApi'
import images from '../Themes/Images'
import { 
  getChatUID, isTopicExist, addNewTopicNode, setNewConversation, getUserData 
} from '../../store/messageApi/messagesApi'
import firebase from '../../config/fbConfig'

const JobTable = ({jobs, selectedTable, onShowBids}) => {
  return (
    <div className="card-panel ">
      <div className="card-content black-text">
        <div className="card-action">
          <table className="striped hoverable">
            <thead>
              <tr>
                <th>Job No</th>
                <th>Site</th>
                <th>Department</th>
                <th>Ward</th>
                <th>Discription</th>
                <th>Manager</th>
                <th>Cost</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs
                .filter(job => {
                  if(selectedTable === "Vacant") {
                    return job.type == "Vacant" && new Date(job.date) >= new Date()
                  } else if(selectedTable === "Filled") {
                    return job.type == "Filled"
                  } else if(selectedTable === "Unfilled") {
                    return job.type == "Vacant" && new Date(job.date) < new Date()
                  }
                })
                .map(job => (
                  <tr key={job.id} className="hoverable">
                    <td>
                      {//<Link to={`/showuser/`}>{job.name}</Link>
}
                       {job.name}
                   </td>
                    <td>{job.site}</td>
                    <td>{job.dep}</td>
                    <td>{}</td>
                    <td>{job.name}</td>
                    <td>{}</td>
                    <td>{job.cost}</td>
                    <td>{job.date}</td>
                    <td>
                      {
                        selectedTable === "Vacant" &&
                        <button onClick={onShowBids(job)} className="btn btn-success" style={{marginLeft: '10px'}}>
                          Show bids
                        </button> 
                      }
                      {
                        selectedTable === "Filled" &&
                        <button onClick={onShowBids(job)} className="btn btn-success" style={{marginLeft: '10px'}}>
                          Show Hires
                        </button> 
                      }
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const BidsTable = ({
  bids, onShowJobs, onMessage, onHire, currentJob, onApprovePayment
}) => {
  return (
    <div className="card-panel ">
      <div className="card-content black-text">
      <img
          style={{width: '30px'}}
          src={images.back}
          alt="icon send"
          onClick={onShowJobs}
      />
        <div className="card-action">
          <table className="striped hoverable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Bid Price</th>
                <th>Freelancer Name</th>
                <th>Times</th>
                <th></th>
                {currentJob.type === "Vacant" &&
                  <th></th>
                }
              </tr>
            </thead>
            <tbody>
              {bids
                .map(bid => (
                  <tr key={bid.id} className="hoverable">
                    <td>{bid.date}</td>
                    <td>{bid.price}</td>
                    <td>{bid.freelancerName}</td>
                    <td>{bid.times.join(", ")}</td>
                    <td>
                      <button onClick={onMessage(bid)} className="btn btn-success">
                        Message
                      </button>
                    </td>
                    {
                      currentJob.type === "Vacant" &&
                      <td>
                        <button onClick={onHire(bid)} className="btn btn-success">
                          Hire
                        </button>
                      </td>
                    } 
                    {
                      currentJob.type === "Filled" && !currentJob.completed &&
                      <td>
                        <button onClick={onApprovePayment(bid)} className="btn btn-success">
                         Approve Payment
                        </button>
                      </td>
                    }       
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export class Jobs extends Component {

  state = {
    showBids: false,
    bids: [],
    currentJob: ""
  }

  onShowBids = (job) => () => {
    getBidsForJobId(job.id, (err, data) => {
      this.setState({ bids: data, currentJob: job})
      this.props.onShowBids()
    })
  }

  onShowJobs = () => {
    this.setState({ bids: [], currentJob: ""})
    this.props.onShowJobs()
  }

  onMessage = (bid) => () => {
    getUserData(bid.uid, (error, response) => {
      var chatUID = getChatUID(bid.uid, this.props.auth.uid, this.state.currentJob.name);
      response.id = bid.uid
      isTopicExist(chatUID, (exists) => {
        if (exists) {
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: this.state.currentJob.name
            }
          })
        } else {
          addNewTopicNode(this.state.currentJob.name, chatUID);
          setNewConversation(this.props.auth.uid, bid.uid, chatUID, this.state.currentJob.name);
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: this.state.currentJob.name
            }
          })
        }
      });
    })
  }

  formatDate = (d) => {
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
        
    if (day.length < 2) {
        day = '0' + day;
    } 
        

    return [year, month, day].join('-');
   }

  onApprovePayment = (bid) => () => {
    const jobData = {
      ...this.state.currentJob,
      coordinates: new firebase.firestore.GeoPoint(this.state.currentJob.coordinates._lat, this.state.currentJob.coordinates._long),
      type: "Filled",
      completed: true
    }
    this.props.firestore.update({ collection: "jobs", doc: this.state.currentJob.id }, {d: jobData});
    alert("The payment has been approved")

    let paymentData = {
      amount: bid.price * bid.times.length,
      freelancerName: bid.freelancerName,
      agencyName: `${this.props.profile.firstName} ${this.props.profile.lastName}`,
      date: this.formatDate(new Date()),
      status: 'PENDING',
      freelancerId: bid.uid,
      agencyId: this.props.auth.uid,
      jobName: this.state.currentJob.name
    }

    this.props.firestore.add({ collection: "payments" }, paymentData);
    this.props.handleClick("Filled")
  }

  onHire = (bid) => () => {
    const jobData = {
      ...this.state.currentJob,
      coordinates: new firebase.firestore.GeoPoint(this.state.currentJob.coordinates._lat, this.state.currentJob.coordinates._long),
      type: "Filled"
    }
    const bidData = {
      ...bid,
      approved: true
    }
    this.props.firestore.update({ collection: "jobs", doc: this.state.currentJob.id }, {d: jobData});
    this.props.firestore.update({ collection: "Bids", doc: bid.id }, bidData);
    this.props.handleClick("Filled")
  }

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    let { jobs, selectedTable } = this.props;
    if(jobs){
      jobs = jobs.map(j => {
        return {
          ...j.d,
          id: j.id
        }
      }).sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    if (jobs && !this.props.showBids) {
      return <JobTable 
        jobs={jobs} 
        selectedTable={selectedTable} 
        onShowBids={this.onShowBids} 
      />
    }

    if(this.props.showBids) {
      return <BidsTable 
        bids={this.state.currentJob.type === "Vacant" 
          ? this.state.bids : this.state.bids.filter(b => b.approved)} 
        onShowJobs={this.onShowJobs}
        onMessage={this.onMessage}
        onHire={this.onHire}
        currentJob={this.state.currentJob}
        onApprovePayment={this.onApprovePayment}
      />
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: state.firestore.ordered.jobs,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "jobs",
      where: ["d.uid", "==", props.auth.uid],
    }
  ])
)(Jobs);
