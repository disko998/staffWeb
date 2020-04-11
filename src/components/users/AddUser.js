import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { addUser } from "../../store/actions/addUser";
import M from "materialize-css";

export class AddUser extends Component {
  state = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    isSingleSite: "true",
    isSingleDep: "true",
    accountName: "",
    orgType: "",
    uid: this.props.auth.uid
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.addUser(this.state);
    this.props.history.push("/users");
  };

  componentDidMount() {
    M.AutoInit();
  }

  render() {
    const { auth, authError } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;

    const { deps, sites } = this.props;

    if (sites && deps) {
      return (
        <div className="container">
          <form className="white" onSubmit={this.handleSubmit}>
            <h5 className="grey-text text-darken-3">
              Add New User in Your Orgnazation
            </h5>
            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                onChange={this.handleChange}
              />
            </div>
            <div className="input-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange={this.handleChange}
              />
            </div>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={this.handleChange}
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={this.handleChange}
              />
            </div>

            <table>
              <tbody>
                <tr>
                  <td>
                    <div className="input-field">
                      <select
                        name="orgType"
                        onChange={this.handleChange}
                        className="browser-default"
                        defaultValue={"DEFAULT"}
                      >
                        <option value="DEFAULT" disabled>
                          Choose the Site
                        </option>
                        {sites.map(site => (
                          <option key={site.id} value={site.id}>
                            {site.siteName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="input-field">
                      <select
                        multiple
                        className="browser-default"
                        name="orgType"
                        onChange={this.handleChange}
                      >
                        <option value="" disabled>
                          Choose the Department
                        </option>
                        {deps.map(dep => (
                          <option key={dep.id} value={dep.id}>
                            {dep.depName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="input-field">
              <button className="btn ">Add User</button>
            </div>
            <div className="input-field">
              <Link to="/users" className="btn">
                Back to User List
              </Link>
              <div className="center red-text">
                {authError ? <p>{authError}</p> : null}
              </div>
            </div>
          </form>
        </div>
      );
    } else return null;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addUser: creds => dispatch(addUser(creds))
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    deps: state.firestore.ordered.deps,
    sites: state.firestore.ordered.sites,
    auth: state.firebase.auth,
    authError: state.user.authError2
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => [
    {
      collection: "deps",
      where: ["uid", "==", props.auth.uid]
    },
    {
      collection: "sites",
      where: ["uid", "==", props.auth.uid]
    }
  ])
)(AddUser);
