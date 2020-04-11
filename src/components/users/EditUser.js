import React, { Component } from "react";

import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

export class EditUser extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: ""
  };
  onSubmit = e => {
    e.preventDefault();
    const { id } = this.props;

    const itemUpdates = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email
    };
    this.props.firestore.update({ collection: "users", doc: id }, itemUpdates);

    this.props.history.push("/user/" + id);
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  componentDidMount() {
    if (this.props.user) {
      this.setState({
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName
      });
    }
    console.log(this.state);
  }
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { user } = this.props;
    if (user) {
      return (
        <div className="container">
          <div className="card-panel ">
            <span className="card-title">Edit User</span>
            <br />
            <br />
            <br />
            <div className="card-action" />
            <Link to="/users" className="btn">
              Back to User List
            </Link>
            <div className="panel-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="First Name">
                    First Name: <b>{user.firstName}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    id="firstName"
                    onChange={this.handleChange}
                    placeholder="Edit First Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Last Name">
                    Last Name: <b>{user.lastName}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    id="lastName"
                    onChange={this.handleChange}
                    placeholder="Edit Last Name"
                  />
                </div>{" "}
                <div className="form-group">
                  <label htmlFor="Email">
                    Email: <b>{user.email}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    id="email"
                    onChange={this.handleChange}
                    placeholder="Edit Email"
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  //console.log(state);
  const id = ownProps.match.params.id;
  const users = state.firestore.data.users;
  const user = users ? users[id] : null;

  return {
    id,
    user,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "users"
    }
  ])
)(EditUser);
