import React, { Component } from "react";

import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

export class EditDep extends Component {
  state = {
    depName: "",
    depNo: "",
    depSite: "",
    depManager: "",
    depTel: ""
  };
  onSubmit = e => {
    e.preventDefault();
    const { id } = this.props;

    const itemUpdates = {
      depName: this.state.depName,
      depNo: this.state.depNo,
      depSite: this.state.depSite,
      depManager: this.state.depManager,
      depTel: this.state.depTel
    };
    this.props.firestore.update({ collection: "deps", doc: id }, itemUpdates);

    this.props.history.push("/deps/" + id);
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  componentDidMount() {
    if (this.props.dep) {
      this.setState({
        depName: this.props.dep.depName,
        depNo: this.props.dep.depNo,
        depSite: this.props.dep.depSite,
        depManager: this.props.dep.depManager,
        depTel: this.props.dep.depTel
      });
    }
    console.log(this.state);
  }
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { dep } = this.props;
    if (dep) {
      return (
        <div className="container">
          <div className="card-panel ">
            <span className="card-title">Edit Department</span>
            <br />
            <br />
            <br />
            <div className="card-action" />
            <Link to="/deps" className="btn">
              Back to Department List
            </Link>
            <div className="panel-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="Department Name">
                    First Name: <b>{dep.depName}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="depName"
                    id="depName"
                    onChange={this.handleChange}
                    placeholder="Edit Department Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Department Site">
                    Department Site: <b>{dep.depSite}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="depSite"
                    id="depSite"
                    onChange={this.handleChange}
                    placeholder="Edit Department Site"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Department Manager">
                    Department Manager: <b>{dep.depManager}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="depManager"
                    id="depManager"
                    onChange={this.handleChange}
                    placeholder="Edit Department Manager"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Department Telephone">
                    Department Telephone: <b>{dep.depTel}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="depTel"
                    id="depTel"
                    onChange={this.handleChange}
                    placeholder="Edit Department Telephone"
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
  const id = ownProps.match.params.id;
  const deps = state.firestore.data.deps;
  const dep = deps ? deps[id] : null;
  //console.log(dep);
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
)(EditDep);
