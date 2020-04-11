import React, { Component } from "react";

import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

export class ShowSite extends Component {
  delete = e => {
    const { id } = this.props;
    console.log(this.props);
    this.props.firestore.delete({ collection: "sites", doc: id });
    this.props.history.push("/sites");
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { site, id } = this.props;
    if (site) {
      return (
        <div className="container">
          <div className="card-panel ">
            <span className="card-title">Site Detail</span>
            <br />
            <br />
            <br />
            <div className="card-action">
              <Link to="/sites" className="btn">
                Back to Site List
              </Link>
            </div>
            <br />
            <br />
            <br />

            <table className="striped centered hoverable">
              <thead>
                <tr>
                  <th>Site #</th>
                  <th>Site Name</th>
                  <th>Site Address</th>
                  <th>Site Mangaer</th>
                  <th>Site Telephone</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr key={site.id} className="hoverable">
                  <td>{site.siteNo}</td>
                  <td>{site.siteName}</td>
                  <td>{site.siteAdd}</td>
                  <td>{site.siteManager}</td>
                  <td>{site.siteTel}</td>

                  <td>
                    <Link to={`/editsite/${id}`} className="btn ">
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
  const sites = state.firestore.data.sites;
  const site = sites ? sites[id] : null;

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
)(ShowSite);
