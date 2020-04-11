import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";


export class Sites extends Component {
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { sites } = this.props;
    if (sites) {
      return (
        <div className="container">
          <div className="card-panel ">
            <div className="card-content black-text">
              <span className="card-title">Site List</span>
              <br />
              <br />
              <br />
              <div className="card-action">
                <Link to="/addsite" className="btn">
                  Add New Site
                </Link>
                <br />
                <br />
                <br />
                <table className="striped hoverable">
                  <thead>
                    <tr>
                      <th>Site Number</th>
                      <th>Site Name</th>
                      <th>Site Address</th>
                      <th>Site Mangaer</th>
                      <th>Site Telephone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sites.map(site => (
                      <tr key={site.id} className="hoverable">
                        <td>
                          <Link to={`/showsite/${site.id}`}>{site.siteNo}</Link>
                        </td>
                        <td>{site.siteName}</td>
                        <td>{site.siteAdd}</td>
                        <td>{site.siteManager}</td>
                        <td>{site.siteTel}</td>
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
    sites: state.firestore.ordered.sites,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "sites",
      where: ["uid", "==", props.auth.uid]
    }
  ])
)(Sites);
