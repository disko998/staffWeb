import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

export class AddDep extends Component {
  state = {
    depName: "",
    depNo: "",
    depSite: "",
    depManager: "",
    depTel: ""
  };
  onSubmit = e => {
    e.preventDefault();

    const itemAdd = {
      depName: this.state.depName,
      depNo: this.state.depNo,
      depSite: this.state.depSite,
      depManager: this.state.depManager,
      depTel: this.state.depTel,
      uid: this.props.auth.uid
    };
    console.log(itemAdd);
    this.props.firestore.add({ collection: "deps" }, itemAdd);

    this.props.history.push("/deps/");
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    console.log(auth);
    return (
      <div className="container">
        <div className="card-panel ">
          <span className="card-title">Add Department </span>
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
                <label htmlFor="Department No">Department Number:</label>
                <input
                  type="text"
                  className="form-control"
                  name="depNo"
                  id="depNo"
                  onChange={this.handleChange}
                  placeholder="Type Department Number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="Department Name">Department Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="depName"
                  id="depName"
                  onChange={this.handleChange}
                  placeholder="Type Department Name"
                />
              </div>{" "}
              <div className="form-group">
                <label htmlFor="Department Site">Department Site:</label>
                <input
                  type="text"
                  className="form-control"
                  name="depSite"
                  id="depSite"
                  onChange={this.handleChange}
                  placeholder="Type Department Site"
                />
              </div>
              <div className="form-group">
                <label htmlFor="Department Manager">Department Mangaer:</label>
                <input
                  type="text"
                  className="form-control"
                  name="depManager"
                  id="depManager"
                  onChange={this.handleChange}
                  placeholder="Type Department Manager Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="Department Telephone">
                  Department Telephone:
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="depTel"
                  id="depTel"
                  onChange={this.handleChange}
                  placeholder="Type Department Telephone"
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
}

const mapStateToProps = (state, ownProps) => {
  //console.log(state);

  return {
    //deps: state.firestore.data.deps,
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
)(AddDep);
