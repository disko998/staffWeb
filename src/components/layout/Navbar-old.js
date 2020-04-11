import React from "react";
import { Link } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import UserSignedInLinks from "./UserSignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import SuperAdminLinks from "./SuperAdminLinks"
import { connect } from "react-redux";

const Navbar = props => {
  const { auth, profile } = props;
  console.log(profile);
  let links = null;
  if (auth.uid) {
    if(profile.superAdmin) {
      links = <SuperAdminLinks profile={profile} />;
    }
    else if (profile.isAdmin) {
      links = <SignedInLinks profile={profile} />;
    } else {
      links = <UserSignedInLinks profile={profile} />;
    }
  } else {
    links = <SignedOutLinks />;
  }

  return (
    <nav className="nav-wrapper blue darken-5">
      <div className="container">
        <Link to="/" className="brand-logo">
          {profile.accountName ? profile.accountName : "Staffa"}
        </Link>
        {links}
      </div>
    </nav>
  );
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default connect(mapStateToProps)(Navbar);
