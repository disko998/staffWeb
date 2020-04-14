import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import Strings from "../../utilities/Strings";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Maps } from "../sites/Map";
import { updateProfile } from "../../store/bidApi/bidApi";

const Timeslots = [
  "00:00",
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00"
];

const options = Timeslots.map(d => {
  return { key: d, text: d, value: d };
});
export class CreateJob extends Component {
  state = {
    jobNo: Math.floor(100000 + Math.random() * 900000),
    name: "",
    site: "",
    dep: "",
    cost: "",
    showFundShift: false,
    showSubmitButton: false,
    latitude: "",
    longitude: "",
    startDate: new Date(),
    slots: {},
    currentSlot: []
  };

  formatDate = d => {
    var month = "" + (d.getMonth() + 1);
    var day = "" + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  handleDateChange = date => {
    this.setState({
      startDate: date
    });
  };

  onSubmit = e => {
    e.preventDefault();
    let number = Object.values(this.state.slots).reduce((next, s) => {
      return (next += s.length);
    }, 0);
    const totalCost = number * this.state.cost;
    if (this.props.profile.budget < totalCost) {
      alert(
        "Insufficient funds in the account. Please add more funds or tell your owner to allocate more"
      );
      return;
    }

    const itemAdd = {
      jobNo: this.state.jobNo,
      name: this.state.name,
      site: this.state.site,
      dep: this.state.dep,
      cost: this.state.cost,
      type: "Vacant",
      uid: this.props.auth.uid,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      slots: this.state.slots,
      agencyName: `${this.props.profile.firstName} ${this.props.profile.lastName}`
    };
    console.log(itemAdd);
    // this.props.firestore.add({ collection: "jobs" }, itemAdd);

    fetch(`${Strings.BASE_URL}/saveJobs`, {
      method: "POST",
      body: JSON.stringify(itemAdd)
    })
      .then(response => {
        console.log(response);
        const budget = this.props.profile.budget - totalCost;
        this.props.firestore.update(
          { collection: "Users", doc: this.props.auth.uid },
          { budget }
        );
        setTimeout(() => {
          this.props.history.push("/jobboard");
        }, 2000);
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleChange = e => {
    this.setState(
      {
        [e.target.id]: e.target.value
      },
      this.handleStateUpdate
    );
  };

  handleStateUpdate = () => {
    const showSubmitButton =
      !!this.state.jobNo &&
      !!this.state.name &&
      //!!this.state.site &&
      //!!this.state.dep &&
      !!this.state.cost &&
      !!this.state.latitude &&
      !!this.state.longitude &&
      !!Object.keys(this.state.slots).length;
    this.setState({ showSubmitButton });
  };

  useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position =>
        this.setState(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          this.handleStateUpdate
        ),
      err => alert("Please share your location")
    );
  };

  useSavedLocation = () => {
    this.setState(
      {
        latitude: Number(this.props.profile.latitude),
        longitude: Number(this.props.profile.longitude)
      },
      this.handleStateUpdate
    );
  };

  onDropdownChange = (event, { value }) => {
    this.setState({
      currentSlot: value
    });
  };

  onSiteChange = (event, { value }) => {
    this.setState({ site: value });
  };

  onDepChange = (event, { value }) => {
    this.setState({ dep: value });
  };

  onAddSlot = () => {
    const formattedDate = this.formatDate(this.state.startDate);
    this.setState(
      {
        slots: { [formattedDate]: this.state.currentSlot, ...this.state.slots },
        currentSlot: []
      },
      this.handleStateUpdate
    );
  };

  removeSlot = k => () => {
    let slots = { ...this.state.slots };
    delete slots[k];
    this.setState({ slots }, this.handleStateUpdate);
  };

  render() {
    const { auth } = this.props;

    const deps = this.props.deps
      ? this.props.deps.map(d => {
          return { key: d.depName, value: d.depName, text: d.depName };
        })
      : [];

    const sites = this.props.sites
      ? this.props.sites.map(s => {
          return { key: s.siteName, value: s.siteName, text: s.siteName };
        })
      : [];

    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="container">
        <div className="card-panel ">
          <span className="card-title">Add New Shift</span>
          <br />
          <br />
          <br />
          <div className="card-action" />
          <Link to="/jobboard" className="btn">
            Back to JobBoard
          </Link>
          <div className="panel-body">
            <div className="form-group">
              <label htmlFor="Job No">Job Number:</label>
              <input
                type="text"
                className="form-control"
                name="jobNo"
                id="jobNo"
                onChange={this.handleChange}
                placeholder="Type Job Number"
                value={this.state.jobNo}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="Name">Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                id="name"
                onChange={this.handleChange}
                placeholder="Type Name"
                value={this.state.name}
              />
            </div>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              {Object.keys(this.state.slots).map(k => {
                const slots = this.state.slots[k].map(s => {
                  return (
                    <p
                      style={{
                        display: "inline-block",
                        marginLeft: "5px",
                        marginRight: "5px",
                        background: "#e8e8e8",
                        padding: "4px 10px"
                      }}
                    >
                      {s}
                    </p>
                  );
                });
                return (
                  <div
                    style={{
                      padding: "0 10px",
                      borderWidth: "1px",
                      borderColor: "#e8e8e8"
                    }}
                  >
                    <p style={{ display: "inline-block" }}>Date: {k}</p>
                    <p style={{ display: "inline-block", marginLeft: "10px" }}>
                      Slots
                    </p>
                    {slots}
                    <Icon name="close" link onClick={this.removeSlot(k)} />
                  </div>
                );
              })}
            </div>
            <div className="form-group">
              <label htmlFor="date" style={{ display: "block" }}>
                Date & Time Slots:
              </label>
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleDateChange}
                className={{ width: "100%" }}
                minDate={new Date()}
              />
              <Dropdown
                placeholder="Time Slots"
                fluid
                multiple
                selection
                options={options}
                style={{
                  width: "50%",
                  display: "inline-block",
                  marginLeft: "20px"
                }}
                onChange={this.onDropdownChange}
                value={this.state.currentSlot}
              />
              {!!this.state.currentSlot.length && (
                <button
                  onClick={this.onAddSlot}
                  className="btn btn-success"
                  style={{ marginLeft: "10px" }}
                >
                  Add
                </button>
              )}
            </div>

            <div className="form-group" style={{ marginTop: "20px" }}>
              <label htmlFor="Name">Location:</label>
              <button
                onClick={this.useCurrentLocation}
                className="btn btn-success"
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                Use Current Location
              </button>
              <button
                onClick={this.useSavedLocation}
                className="btn btn-success"
                style={{ marginRight: "10px" }}
              >
                Use Saved Location
              </button>
            </div>
            {!!this.state.latitude && !!this.state.longitude && (
              <div style={{ margin: "20px 0" }}>
                <Maps
                  isMarkerShown
                  markerPosition={{
                    lat: this.state.latitude,
                    lng: this.state.longitude
                  }}
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="Site">Site:</label>
              <Dropdown
                placeholder="Select Site"
                fluid
                selection
                options={sites}
                onChange={this.onSiteChange}
                value={this.state.site}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Department">Department:</label>
              <Dropdown
                placeholder="Select Department"
                fluid
                selection
                options={deps}
                onChange={this.onDepChange}
                value={this.state.dep}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Cost">Cost:</label>
              <input
                type="text"
                className="form-control"
                name="cost"
                id="cost"
                onChange={this.handleChange}
                placeholder="Type Cost"
                value={this.state.cost}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Cost">Cost:</label>
              <input
                type="text"
                className="form-control"
                name="cost"
                id="cost"
                onChange={this.handleChange}
                placeholder="Type Cost"
                value={this.state.cost}
              />
            </div>

            {this.state.showSubmitButton && (
              <button onClick={this.onSubmit} className="btn btn-success">
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  //console.log(state);

  return {
    deps: state.firestore.ordered.deps,
    sites: state.firestore.ordered.sites,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
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
)(CreateJob);
