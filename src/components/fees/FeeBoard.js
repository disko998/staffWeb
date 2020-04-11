import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";
import { getBidsForJobId } from '../../store/bidApi/bidApi'
import images from '../Themes/Images'
import {  
  getUserData,
  addNewTopicNode,
  setNewConversation,
  isTopicExist,
  getChatUID,
  getUserConversationNode,
  getConversationMessagesNode
} from '../../store/messageApi/messagesApi'

import TaxView from './TaxView'

const isGreaterThanSevenDays = (date) => {
  const sevenDaysInMillis = 7 * (86400 * 1000)
  const myDate = new Date(date)
  const todayDate = new Date()

  return Math.abs(todayDate - myDate) > sevenDaysInMillis
}


const JobTable = ({jobs, onMessageAgency}) => {
  return (
    <div className="card-panel ">
      <div className="card-content black-text">
        <div className="card-action">
          <table className="striped hoverable">
            <thead>
              <tr>
                <th>Job Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Agency Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs
                .map(job => (
                  <tr key={job.id} className="hoverable">
                    <td>{job.d.name}</td>
                    <td>{job.d.cost}</td>
                    <td>{job.d.date}</td>
                    <td>{job.d.agencyName}</td>
                    <td>
                      <button onClick={onMessageAgency({agencyId: job.uid, jobName: job.d.name})} className="btn btn-success">
                      Message Agency
                      </button>
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

const PaymentTable = ({payments, selectedTable, onMessageAgency, onMessageFreelancer, onApprovePayment}) => {
  return (
    <div className="card-panel ">
      <div className="card-content black-text">
        <div className="card-action">
          <table className="striped hoverable">
            <thead>
              <tr>
                <th>Approved Date</th>
                <th>Amount</th>
                <th>Freelancer Name</th>
                <th>Agency Name</th>
                {
                  selectedTable === "Paid" &&
                  <th>Payment Date</th>
                }
                {
                  selectedTable === "Paid" &&
                  <th>Tax</th>
                }
                {
                  selectedTable === "Paid" &&
                  <th>Fees</th>
                }
                <th></th>
                <th></th>
                {
                  selectedTable === "Pending" &&
                  <th></th>
                }
              </tr>
            </thead>
            <tbody>
              {payments
                .map(payment => (
                  <tr key={payment.id} className="hoverable">
                    <td style={isGreaterThanSevenDays(payment.date) ? {color: 'red'} : {}}>{payment.date}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.freelancerName}</td>
                    <td>{payment.agencyName}</td>
                    {
                      selectedTable === "Paid" &&
                      <th>{payment.paymentDate}</th>
                    }
                    {
                      selectedTable === "Paid" &&
                      <th>{payment.tax}</th>
                    }
                    {
                      selectedTable === "Paid" &&
                      <th>{payment.fees}</th>
                    }
                    <td>
                      <button onClick={onMessageAgency(payment)} className="btn btn-success">
                      Message Agency
                      </button>
                    </td>
                    <td>
                      <button onClick={onMessageFreelancer(payment)} className="btn btn-success">
                      Message Freelancer
                      </button>
                    </td>
                    {
                      selectedTable === "Pending" &&
                      <td>
                          <button onClick={onApprovePayment(payment)} className="btn btn-success">
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



export class FeeBoard extends Component {

  state = {
    currentPayment: {}
  }

  onMessageAgency = (payment) => () => {
    getUserData(payment.agencyId, (error, response) => {
      var chatUID = getChatUID(payment.agencyId, this.props.auth.uid, payment.jobName);
      response.id = payment.agencyId
      isTopicExist(chatUID, (exists) => {
        if (exists) {
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: payment.jobName
            }
          })
        } else {
          addNewTopicNode(payment.jobName, chatUID);
          setNewConversation(this.props.auth.uid, payment.agencyId, chatUID, payment.jobName);
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: payment.jobName
            }
          })
        }
      });
    })
  }

  onMessageFreelancer = (payment) => () => {
    getUserData(payment.freelancerId, (error, response) => {
      var chatUID = getChatUID(payment.freelancerId, this.props.auth.uid, payment.jobName);
      response.id = payment.freelancerId
      isTopicExist(chatUID, (exists) => {
        if (exists) {
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: payment.jobName
            }
          })
        } else {
          addNewTopicNode(payment.jobName, chatUID);
          setNewConversation(this.props.auth.uid, payment.freelancerId, chatUID, payment.jobName);
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: payment.jobName
            }
          })
        }
      });
    })
  }

  onApprovePayment = (payment) => () => {
    this.props.onApprovePayment(payment)
    this.setState({ currentPayment: payment })
  }

  sendMessage = (recieverId, chatUID, payment) => {
    this.userConversationNode = getUserConversationNode(this.props.auth.uid, chatUID);
    this.receiverConversationNode = getUserConversationNode(recieverId, chatUID);
    this.messagesCollection = getConversationMessagesNode(chatUID);

    var message = this.messagesCollection.doc();
    var data = {
        message: `The payment has been approved with jobName: ${payment.jobName}, amount: ${payment.amount}`,
        sender: this.props.auth.uid,
        receiver: recieverId,
        time: new Date().toString(),
    }
    message.set(data);
    // Update last message id - sender
    this.userConversationNode.update({ lastMessageID: message.id });
    // Update last message id - receiver
    this.receiverConversationNode.update({ lastMessageID: message.id });
  }

  sendApprovalMessageFreelancer = (payment) => {
    var chatUID = getChatUID(payment.freelancerId, this.props.auth.uid, payment.jobName);
    isTopicExist(chatUID, (exists) => {
      if (exists) {
        this.sendMessage(payment.freelancerId, chatUID, payment)
      } else {
        addNewTopicNode(payment.jobName, chatUID);
        setNewConversation(this.props.auth.uid, payment.freelancerId, chatUID, payment.jobName);
        this.sendMessage(payment.freelancerId, chatUID, payment)
      }
    });
  }

  sendApprovalMessageAgency = (payment) => {
    var chatUID = getChatUID(payment.agencyId, this.props.auth.uid, payment.jobName);
    isTopicExist(chatUID, (exists) => {
      if (exists) {
        this.sendMessage(payment.agencyId, chatUID, payment)
      } else {
        addNewTopicNode(payment.jobName, chatUID);
        setNewConversation(this.props.auth.uid, payment.agencyId, chatUID, payment.jobName);
        this.sendMessage(payment.agencyId, chatUID, payment)
      }
    });
  }

  goBack = () => {
    this.setState({currentPayment: {}})
    this.props.goBack()
  }


  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    let { jobs, selectedTable, payments } = this.props;

    if(jobs && payments) {
      if(this.props.selectedTable === "Escrowed") {
        return <JobTable 
          jobs={jobs} 
          selectedTable={selectedTable}
          onMessageAgency={this.onMessageAgency}
        />
      }else if(this.props.selectedTable === "Pending" && this.props.showPayment) {
        return <TaxView 
          payment={this.state.currentPayment}
          sendApprovalMessageAgency={this.sendApprovalMessageAgency}
          sendApprovalMessageFreelancer={this.sendApprovalMessageFreelancer}
          firestore={this.props.firestore}
          goBack={this.goBack}
        />
      } else {
        return <PaymentTable 
          payments={payments} 
          selectedTable={selectedTable}
          onMessageAgency={this.onMessageAgency}
          onMessageFreelancer={this.onMessageFreelancer}
          onApprovePayment={this.onApprovePayment} 
        />
      }
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
  connect(mapStateToProps)
)(FeeBoard);
