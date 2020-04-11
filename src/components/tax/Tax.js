import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";
import {  
  getUserData,
  addNewTopicNode,
  setNewConversation,
  isTopicExist,
  getChatUID
} from '../../store/messageApi/messagesApi'

export class Tax extends Component {

  messageAgency = (payment) => () => {
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

  messageFreelancer = (payment) => () => {
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

  render() {
    const { auth, profile } = this.props;
    if (!auth.uid || !profile.superAdmin) return <Redirect to="/signin" />;
    let { payments } = this.props;

    if (payments) {
      return (
        <div className="dashboard container">
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
                      <th>Paid Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments
                      .map(payment => (
                        <tr key={payment.id} className="hoverable">
                          <td>{payment.date}</td>
                          <td>{payment.amount}</td>
                          <td>{payment.freelancerName}</td>    
                          <td>{payment.agencyName}</td>  
                          <td>{payment.paymentDate}</td>  
                          <td>
                              <button onClick={this.messageAgency(payment)} className="btn btn-success">
                              Message Agency
                              </button>
                            </td>
                            <td>
                              <button onClick={this.messageFreelancer(payment)} className="btn btn-success">
                              Message Freelancer
                              </button>
                            </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    payments: state.firestore.ordered.payments,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "payments",
      where: [
        "status", "==", "PAID"
      ]
    }
  ])
)(Tax);
