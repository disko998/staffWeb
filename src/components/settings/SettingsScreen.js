import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signUp } from "../../store/actions/authActions";
import * as M from "materialize-css";
import { updateProfile, updateBudget } from "../../store/bidApi/bidApi";
const stripe = window.Stripe("pk_test_POOtIVB0yOmKQynAjn7VoOEK");

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.profile.email || "",
      firstName: props.profile.firstName || "",
      lastName: props.profile.lastName || "",
      accountName: props.profile.accountName || "",
      latitude: props.profile.latitude || "",
      longitude: props.profile.longitude || "",
      location:
        !!props.profile.latitude && props.profile.longitude
          ? `${props.profile.latitude}, ${props.profile.longitude}`
          : "",
      uid: props.auth.uid,
      budget: props.profile.budget || "0"
    };
    setTimeout(() => {
      M.updateTextFields();
    }, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profile !== nextProps.profile) {
      this.setState({
        email: nextProps.profile.email || "",
        firstName: nextProps.profile.firstName || "",
        lastName: nextProps.profile.lastName || "",
        accountName: nextProps.profile.accountName || "",
        latitude: nextProps.profile.latitude || "",
        longitude: nextProps.profile.longitude || "",
        location:
          !!nextProps.profile.latitude && nextProps.profile.longitude
            ? `${nextProps.profile.latitude}, ${nextProps.profile.longitude}`
            : "",
        uid: nextProps.auth.uid,
        budget: nextProps.profile.budget || "0"
      });
      setTimeout(() => {
        M.updateTextFields();
      }, 0);
    }
  }

  componentDidMount() {
    console.log(window.location.href);
    if (window.location.href.includes("response")) {
      let settingsData = localStorage.getItem("settingsData");
      if (!!settingsData) {
        settingsData = JSON.parse(settingsData);
        this.setState(settingsData);
        localStorage.removeItem("settingsData");
        if (window.location.href.includes("success")) {
          alert("Your account has been funded");
          this.setState({ fund: "" });
          updateBudget({
            uid: settingsData.uid,
            budget: Number(settingsData.budget) + Number(settingsData.fund)
          });
        } else {
          alert("Payment failed. Please try again");
        }
      }
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state);
  };

  handleSubmit = e => {
    e.preventDefault();
    updateProfile(this.state);
  };

  useCurrentLocation = e => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      position =>
        this.setState(
          {
            latitude: position.coords.latitude.toFixed(5),
            longitude: position.coords.longitude.toFixed(5)
          },
          () => {
            updateProfile(this.state);
          }
        ),
      err => alert("Please share your location")
    );
  };

  addFunds = e => {
    e.preventDefault();

    const orderData = {
      name: this.state.firstName,
      amount: Number(this.state.fund),
      customerId: this.props.profile.stripe_id,
      customer_email: this.state.email
    };
    console.log("email = " + this.state.email);

    // Url to Firebase function
    fetch(
      "https://us-central1-staffa-13e8a.cloudfunctions.net/createCheckoutSession/",
      {
        method: "POST",
        body: JSON.stringify(orderData)
      }
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        localStorage.setItem("settingsData", JSON.stringify(this.state));
        // Redirecting to payment form page
        stripe
          .redirectToCheckout({
            sessionId: data.sessionId
          })
          .then(function(result) {
            result.error.message;
          });
      });
  };

  render() {
    const { auth, authError } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="container">
        <form className="white">
          <h5 className="grey-text text-darken-3">Settings</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={this.handleChange}
              disabled
              value={this.state.email}
            />
          </div>
          <div className="input-field">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              onChange={this.handleChange}
              value={this.state.firstName}
            />
          </div>
          <div className="input-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={this.handleChange}
              value={this.state.lastName}
            />
          </div>
          <div className="input-field">
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              onChange={this.handleChange}
              value={this.state.accountName}
            />
          </div>
          <div className="input-field">
            <label htmlFor="accountName">Current Budget</label>
            <input
              type="number"
              id="budget"
              name="budget"
              onChange={this.handleChange}
              value={this.state.budget}
            />
          </div>
          <div className="input-field">
            <label htmlFor="defaultLocation">Default Location</label>
            <input
              type="text"
              id="location"
              name="location"
              disabled
              value={this.state.location}
            />
          </div>
          <div className="input-field">
            <label htmlFor="accountName">Fund Amount</label>
            <input
              type="number"
              id="fund"
              name="fund"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <button className="btn" onClick={this.handleSubmit}>
              Update Settings
            </button>
            <button
              onClick={this.useCurrentLocation}
              className="btn btn-success"
              style={{ marginLeft: "10px", marginRight: "10px" }}
            >
              Set Current Location
            </button>
            {this.props.profile.isAdmin && this.state.fund && (
              <button
                onClick={this.addFunds}
                className="btn btn-success"
                style={{ marginLeft: "10px" }}
              >
                Add Funds
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUp: creds => dispatch(signUp(creds))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
