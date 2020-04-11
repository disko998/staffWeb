import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { Dropdown } from 'semantic-ui-react'

const SignedInLinks = props => {

  const options = [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{props.profile.firstName + " " + props.profile.lastName}</strong>
        </span>
      ),
      disabled: true,
    },
    { key: 'settings', text: (
      <NavLink style={{color: 'black'}} to="/settings">Settings</NavLink>
    ) },
    { key: 'log-out', text: (
      <a style={{color: 'black'}} onClick={props.signOut}>Log Out</a>
      ) },
  ]

  return (
    <div>
      <ul className="right">
        <li>
          <NavLink to="/createjob">Post Shift</NavLink>
        </li>
        <li>
          <NavLink to="/jobboard">Jobs Board</NavLink>
        </li>
        <li>
          <NavLink to="/users">Users</NavLink>
        </li>
        <li>
          <NavLink to="/sites">Sites</NavLink>
        </li>
        <li>
          <NavLink to="/deps">Departments</NavLink>
        </li>
       
        <li>
          <NavLink to="/messages">Messages</NavLink>
        </li>
        <li>
          <Dropdown 
            trigger={
              <div className="btn btn-floating blue lighten-1">
                {props.profile.initials}
              </div>
            }
            options={options}
          />
        </li>
      </ul>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SignedInLinks);
