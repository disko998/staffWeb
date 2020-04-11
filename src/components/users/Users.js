import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";
import Budget from './Budget'
import Strings from '../../utilities/Strings'


export class Users extends Component {

  state = {
    showUser: false,
    currentUser: {}
  }

  allocateBudget = (user) => () => {
    this.setState({ showUser: true, currentUser: user})
  }

  goBack = () => {
    this.setState({ showUser: false, currentUser: {}})
  }

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { users } = this.props;
    if (users && !this.state.showUser) {
      return (
        <div className="container">
          <div className="card-panel ">
            <div className="card-content black-text">
              <span className="card-title">User List</span>
              <br />
              <br />
              <br />
              <div className="card-action">
                <Link to="/adduser" className="btn">
                  Add New User
                </Link>
                <br />
                <br />
                <br />
                <table className="striped hoverable">
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Allocated Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="hoverable">
                        <td>
                          <Link to={`/showuser/${user.id}`}>
                            {user.firstName}
                          </Link>
                        </td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.budget || 0}</td>
                        <td>
                        {
                          <td>
                            <button onClick={this.allocateBudget(user)} className="btn btn-success">
                              Allocate Budget
                            </button>
                          </td>
                        }  
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if(this.state.showUser) {
      return <Budget 
        user={this.state.currentUser}
        goBack={this.goBack}
        auth={this.props.auth}
        profile={this.props.profile}
        firestore={this.props.firestore}
      />
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);

  return {
    users: state.firestore.ordered.Users,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: Strings.FS_COLLECTION_USERS,
      where: ["uid", "==", props.auth.uid]
    }
  ])
)(Users);
