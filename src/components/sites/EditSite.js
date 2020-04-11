import React, { Component } from "react";

import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

export class EditSite extends Component {
  state = {
    siteName: "",
    siteNo: "",
    siteAdd: "",
    siteManager: "",
    siteTel: ""
  };
  onSubmit = e => {
    e.preventDefault();
    const { id } = this.props;

    const itemUpdates = {
      siteName: this.state.siteName,
      siteNo: this.state.siteNo,
      siteAdd: this.state.siteAdd,
      siteManager: this.state.siteManager,
      siteTel: this.state.siteTel
    };
    this.props.firestore.update({ collection: "sites", doc: id }, itemUpdates);

    this.props.history.push("/sites/");
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  componentDidMount() {
    if (this.props.site) {
      this.setState({
        siteName: this.props.site.siteName,
        siteNo: this.props.site.siteNo,
        siteAdd: this.props.site.siteAdd,
        siteManager: this.props.site.siteManager,
        siteTel: this.props.site.siteTel
      });
    }
    console.log(this.state);
  }
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { site } = this.props;
    if (site) {
      return (
        <div className="container">
          <div className="card-panel ">
            <span className="card-title">Edit Site</span>
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
                  <label htmlFor="Site Name">
                    Site Name: <b>{site.siteName}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="siteName"
                    id="siteName"
                    onChange={this.handleChange}
                    placeholder="Edit Site Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Site Address">
                    Site Address: <b>{site.siteAdd}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="siteAdd"
                    id="siteAdd"
                    onChange={this.handleChange}
                    placeholder="Edit Site Address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Site Manager">
                    Site Manager: <b>{site.siteManager}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="siteManager"
                    id="siteManager"
                    onChange={this.handleChange}
                    placeholder="Edit Site Manager"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Site Telephone">
                    Site Telephone: <b>{site.siteTel}</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="siteTel"
                    id="siteTel"
                    onChange={this.handleChange}
                    placeholder="Edit Site Telephone"
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
  const sites = state.firestore.data.sites;
  const site = sites ? sites[id] : null;
  //console.log(dep);
  return {
    id,
    site,
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
)(EditSite);
