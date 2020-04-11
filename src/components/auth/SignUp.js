import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signUp } from "../../store/actions/authActions";

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    isSingleSite: "true",
    isSingleDep: "true",
    accountName: "",
    orgType: "",
    type: "agency",
    latitude: "",
    longitude: ""
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude
      }), 
      err => alert("Please share your location")
    );
  }
  
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.signUp(this.state);
  };
  render() {
    const { auth, authError } = this.props;
    if (auth.uid) return <Redirect to="/" />;
    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3">Sign Up</h5>
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
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              onChange={this.handleChange}
            />
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <label>
                    <input
                      id="singleSite"
                      name="isSingleSite"
                      type="radio"
                      value="true"
                      checked={this.state.isSingleSite === "true"}
                      onChange={this.handleChange}
                    />
                    <span>Single Site</span>
                  </label>
                </td>
                <td>
                  <label>
                    <input
                      id="multiSite"
                      name="isSingleSite"
                      type="radio"
                      value="false"
                      checked={this.state.isSingleSite === "false"}
                      onChange={this.handleChange}
                    />
                    <span>Multi Site</span>
                  </label>
                </td>
              </tr>

              <tr>
                <td>
                  <label>
                    <input
                      id="singleDep"
                      name="isSingleDep"
                      type="radio"
                      value="true"
                      checked={this.state.isSingleDep === "true"}
                      onChange={this.handleChange}
                    />
                    <span>Single Department</span>
                  </label>
                </td>
                <td>
                  <label>
                    <input
                      id="multiDep"
                      name="isSingleDep"
                      type="radio"
                      value="false"
                      checked={this.state.isSingleDep === "false"}
                      onChange={this.handleChange}
                    />
                    <span>Multi Department</span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="input-field">
            <select
              name="orgType"
              onChange={this.handleChange}
              className="browser-default"
              defaultValue={"DEFAULT"}
            >
              <option value="DEFAULT" disabled>
                Please select your orgnazation type
              </option>
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
              <option value="careHome">Care Home</option>
            </select>
          </div>
          <div className="input-field">
            <button className="btn">Sign Up</button>
            <div className="center red-text">
              {authError ? <p>{authError}</p> : null}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUp: creds => dispatch(signUp(creds))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
