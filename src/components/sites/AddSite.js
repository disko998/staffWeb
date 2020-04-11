import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

export class AddSite extends Component {
  state = {
    siteName: "",
    siteNo: "",
    siteSite: "",
    siteManager: "",
    siteTel: ""
  };
  onSubmit = e => {
    e.preventDefault();

    const itemAdd = {
      siteName: this.state.siteName,
      siteNo: this.state.siteNo,
      siteAdd: this.state.siteAdd,
      siteManager: this.state.siteManager,
      siteTel: this.state.siteTel,
      uid: this.props.auth.uid
    };
    console.log(itemAdd);
    this.props.firestore.add({ collection: "sites" }, itemAdd);

    this.props.history.push("/sites/");
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="container">
        <div className="card-panel ">
          <span className="card-title">Add Site</span>
          <br />
          <br />
          <br />
          <div className="card-action" />
          <Link to="/sites" className="btn">
            Back to Site List
          </Link>
          <div className="panel-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="Site No">Site Number:</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  minLength="6"
                  maxLength="6"
                  name="siteNo"
                  id="siteNo"
                  onChange={this.handleChange}
                  placeholder="Type Site Number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="Site Site">Site Address:</label>
                <input
                  type="text"
                  className="form-control"
                  name="siteAdd"
                  id="siteAdd"
                  onChange={this.handleChange}
                  placeholder="Type Site Address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="Site Manager">Site Mangaer:</label>
                <input
                  type="text"
                  className="form-control"
                  name="siteManager"
                  id="siteManager"
                  onChange={this.handleChange}
                  placeholder="Type Site Manager Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="Site Telephone">Site Telephone:</label>
                <input
                  type="text"
                  className="form-control"
                  name="siteTel"
                  id="siteTel"
                  onChange={this.handleChange}
                  placeholder="Type Site Telephone"
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
      collection: "sites"
    }
  ])
)(AddSite);
