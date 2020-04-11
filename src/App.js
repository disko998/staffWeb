import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import JobBoard from "./components/dashboard/JobBoard";
import ProjectDetails from "./components/projects/ProjectDetails";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import CreateProject from "./components/projects/CreateProject";
import CreateJob from "./components/jobs/CreateJob";
import AddUser from "./components/users/AddUser";
import Users from "./components/users/Users";
import Deps from "./components/deps/Deps";
import AddDep from "./components/deps/AddDep";
import ShowDep from "./components/deps/ShowDep";
import AddSite from "./components/sites/AddSite";
import ShowUser from "./components/users/ShowUser";
import EditUser from "./components/users/EditUser";
import EditDep from "./components/deps/EditDep";
import EditSite from "./components/sites/EditSite";
import ShowSite from "./components/sites/ShowSite";
import Sites from "./components/sites/Sites";
import Messages from "./components/messages/MessageScreen";
import Settings from "./components/settings/SettingsScreen";
import Tax from "./components/tax/Tax";
import Fees from "./components/fees/Fees";
import MobileApp from "./components/mobileApp/MobileApp";

class App extends Component {
  componentDidMount() {
    document.body.style.background = "#f7b92b";
  }
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/project/:id" component={ProjectDetails} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/create" component={CreateProject} />
            <Route path="/jobboard" component={JobBoard} />
            <Route path="/messages" component={Messages} />
            <Route path="/settings" component={Settings} />
            <Route path="/createjob" component={CreateJob} />
            <Route path="/users" component={Users} />
            <Route path="/deps" component={Deps} />
            <Route path="/sites" component={Sites} />
            <Route path="/adduser" component={AddUser} />
            <Route path="/tax" component={Tax} />
            <Route path="/fees" component={Fees} />
            <Route path="/mobileApp" component={MobileApp} />

            <Route path="/addsite" component={AddSite} />
            <Route path="/showsite/:id" component={ShowSite} />
            <Route path="/editsite/:id" component={EditSite} />

            <Route path="/adddep" component={AddDep} />
            <Route path="/showuser/:id" component={ShowUser} />
            <Route path="/showdep/:id" component={ShowDep} />
            <Route path="/edituser/:id" component={EditUser} />
            <Route path="/editdep/:id" component={EditDep} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
