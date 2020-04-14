import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";

export class Deps extends Component {
  render() {
    console.log(this.props.deps);
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { deps } = this.props;
    if (deps) {
      return (
        <div className="container">
          <div className="card-panel ">
            <div className="card-content black-text">
              <span className="card-title">Department List</span>
              <br />
              <br />
              <br />
              <div className="card-action">
                <Link to="/adddep" className="btn">
                  Add New Department
                </Link>
                <br />
                <br />
                <br />
                <table className="striped hoverable">
                  <thead>
                    <tr>
                      <th>Dept Number</th>
                      <th>Dept Name</th>
                      <th>Dept Site</th>
                      <th>Dept Mangaer</th>
                      <th>Dept Telephone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deps.map(dep => (
                      <tr key={dep.id} className="hoverable">
                        <td>
                          <Link to={`/showdep/${dep.id}`}>{dep.depNo}</Link>
                        </td>
                        <td>{dep.depName}</td>
                        <td>{dep.depSite}</td>
                        <td>{dep.depManager}</td>
                        <td>{dep.depTel}</td>
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
    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);

  return {
    deps: state.firestore.ordered.deps,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "deps",
      where: ["uid", "==", props.auth.uid]
    }
  ])
)(Deps);
