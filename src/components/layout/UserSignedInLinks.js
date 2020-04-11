import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { Dropdown } from 'semantic-ui-react'

const UserSignedInLinks = props => {

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
)(UserSignedInLinks);
