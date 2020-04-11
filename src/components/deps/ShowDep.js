import React, { Component } from "react";

import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

export class ShowDep extends Component {
  delete = e => {
    const { id } = this.props;
    console.log(this.props);
    this.props.firestore.delete({ collection: "deps", doc: id });
    this.props.history.push("/deps");
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { dep, id } = this.props;
    if (dep) {
      return (
        <div className="container">
          <div className="card-panel ">
            <span className="card-title">Department Detail</span>
            <br />
            <br />
            <br />
            <div className="card-action">
              <Link to="/deps" className="btn">
                Back to Department List
              </Link>
            </div>
            <br />
            <br />
            <br />

            <table className="striped centered hoverable">
              <thead>
                <tr>
                  <th>Dept #</th>
                  <th>Dept Name</th>
                  <th>Dept Site</th>
                  <th>Dept Mangaer</th>
                  <th>Dept Telephone</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr key={dep.id} className="hoverable">
                  <td>{dep.depNo}</td>
                  <td>{dep.depName}</td>
                  <td>{dep.depSite}</td>
                  <td>{dep.depManager}</td>
                  <td>{dep.depTel}</td>

                  <td>
                    <Link to={`/editdep/${id}`} className="btn ">
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
  const deps = state.firestore.data.deps;
  const dep = deps ? deps[id] : null;

  return {
    id,
    dep,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "deps"
    }
  ])
)(ShowDep);
