import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { Dropdown } from 'semantic-ui-react'
import { Redirect } from "react-router-dom";


const SuperAdminLinks = props => {

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
      {
        props.profile.superAdmin && props.profile.tax &&
        <li>
          <Redirect to="/tax" />
          <NavLink to="/tax">Tax</NavLink>
        </li>
      }
      {
        props.profile.superAdmin && props.profile.fees &&
        <li>
          <Redirect to="/fees" />
          <NavLink to="/fees">Fees</NavLink>
        </li>
        
      }
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
)(SuperAdminLinks);
