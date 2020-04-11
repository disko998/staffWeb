import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";
import { updateBudget } from '../../store/bidApi/bidApi'
import images from '../Themes/Images'

export default class Budget extends Component {

  state = {
    budget : 0,
    showButton: false
  }


  addBudget = () => {
    if(!!this.props.profile.budget && this.props.profile.budget > this.state.budget) {
      const budget = !!this.props.user.budget 
      ?  Number(this.state.budget) + Number(this.props.user.budget) : Number(this.state.budget)
      const userBudget = Number(this.props.profile.budget) - Number(this.state.budget)
      this.props.firestore.update({ collection: "Users", doc: this.props.user.id}, {budget});
      updateBudget({
        uid: this.props.auth.uid,
        budget: userBudget
      })
      this.goBack()
    } else {
      alert("Insufficient funds. Please lower the amount or add funds to your account from settings page")
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    }, this.handleStateUpdate);
  };

  handleStateUpdate = () => {
    const showButton = !!this.state.budget
    this.setState({ showButton })
  }

  goBack = () => {
    this.props.goBack()
  }

  render() {
    let { user  } = this.props;
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
        <p>First Name - {user.firstName}</p>
        <p>Last Name - {user.lastName}</p>
        <p>Email - {user.email}</p>
        <p>Current Budget - {user.budget}</p>
        <div className="form-group" >
          <label htmlFor="Name">Budget:</label>
          <input
            type="text"
            className="form-control"
            name="budget"
            id="budget"
            onChange={this.handleChange}
            placeholder="Type budget"
            value={this.state.budget}
          />
        </div>
        {
          !!this.state.showButton && 
            <button onClick={this.addBudget} className="btn btn-success">
            Set Budget
          </button>
        }
        </div>
          </div>
      </div>
    )

    return null;
  }
}
