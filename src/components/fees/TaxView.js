import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";
import { updateBudget } from '../../store/bidApi/bidApi'
import images from '../Themes/Images'
import {  
  getUserData
} from '../../store/messageApi/messagesApi'

export default class TaxView extends Component {

  state = {
    tax : 0,
    fees: 0
  }


  approvePayment = () => {
    const { payment } = this.props
    const paidAmount = payment.amount - this.state.tax - this.state.fees
    this.props.firestore.update({ collection: "payments", doc: payment.id }, {
      tax: this.state.tax,
      fees: this.state.fees,
      paidAmount: paidAmount
    });

    getUserData(payment.freelancerId, (error, response) => {
      fetch('https://us-central1-staffa-13e8a.cloudfunctions.net/approvePayment/', {
      method: 'POST',
      body: JSON.stringify({
        stripe_account: response.stripe_account_id,
        paymentId: payment.id,
        amount: paidAmount
      }),
      }).then(response => {
        return response.json();
      }).then(data => {
        this.props.sendApprovalMessageAgency(payment)
        this.props.sendApprovalMessageFreelancer(payment)
        alert("Payment has been approved")
        this.props.goBack()
      });
    })
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    }, this.handleStateUpdate);
  };

  handleStateUpdate = () => {
    const showButton = !!this.state.tax && !!this.state.fees
    this.setState({ showButton })
  }

  goBack = () => {
    this.props.goBack()
  }

  render() {
    let { payment  } = this.props;
    return (
      <div className="container">
      <div className="card-panel ">
        <div className="card-content black-text">
        <img
            style={{width: '30px'}}
            src={images.back}
            alt="icon send"
            onClick={this.goBack}
        />
        <p>Agency Name - {payment.agencyName}</p>
        <p>Freelancer Name - {payment.freelancerName}</p>
        <p>Amount - {payment.amount}</p>
        <div className="form-group" >
          <label htmlFor="Name">Tax:</label>
          <input
            type="text"
            className="form-control"
            name="tax"
            id="tax"
            onChange={this.handleChange}
            placeholder="Type tax"
            value={this.state.tax}
          />
        </div>
        <div className="form-group" >
          <label htmlFor="Name">Fees:</label>
          <input
            type="text"
            className="form-control"
            name="fees"
            id="fees"
            onChange={this.handleChange}
            placeholder="Type fees"
            value={this.state.fees}
          />
        </div>
        {
          !!this.state.showButton && 
            <button onClick={this.approvePayment} className="btn btn-success">
            Approve Payment
          </button>
        }
        </div>
          </div>
      </div>
    )

    return null;
  }
}
