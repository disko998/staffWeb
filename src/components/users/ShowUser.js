import React, { Component } from "react";

import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

export class ShowUser extends Component {
  delete = e => {
    const { id } = this.props;
    console.log(this.props);
    this.props.firestore.delete({ collection: "users", doc: id });
    this.props.history.push("/users");
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { user, id } = this.props;
    if (user) {
      return (
        <div className="container">
          <div className="card-panel ">
            <span className="card-title">User Detail</span>
            <br />
            <br />
            <br />
            <div className="card-action">
              <Link to="/users" className="btn">
                Back to User List
              </Link>
            </div>
            <br />
            <br />
            <br />

            <table className="striped centered hoverable">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr key={user.id} className="hoverable">
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>

                  <td>
                    <Link to={`/edituser/${id}`} className="btn ">
                      Edit
                    </Link>
                  </td>
                  <td>
                    <button onClick={this.delete} className="btn red">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
)(ShowUser);
