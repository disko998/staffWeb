import React from 'react'
import { Switch, Route } from 'react-router-dom'

import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'

import Users from './components/users/Users'
import Deps from './components/deps/Deps'
import Sites from './components/sites/Sites'

import Dashboard from './components/dashboard/Dashboard'
import JobBoard from './components/dashboard/JobBoard'
import CreateProject from './components/projects/CreateProject'
import CreateJob from './components/jobs/CreateJob'
import ProjectDetails from './components/projects/ProjectDetails'

import Messages from './components/messages/MessageScreen'
import Settings from './components/settings/SettingsScreen'
import Tax from './components/tax/Tax'
import Fees from './components/fees/Fees'
import MobileApp from './components/mobileApp/MobileApp'

const RootRouter = () => (
    <Switch>
        <Route exact path='/' component={Dashboard} />

        <Route path='/signin' component={SignIn} />
        <Route path='/signup' component={SignUp} />

        <Route path='/deps' component={Deps} />
        <Route path='/sites' component={Sites} />
        <Route path='/users' component={Users} />
        <Route path='/createjob' component={CreateJob} />
        <Route path='/settings' component={Settings} />

        <Route path='/jobboard' component={JobBoard} />
        <Route path='/project/:id' component={ProjectDetails} />
        <Route path='/create' component={CreateProject} />

        <Route path='/messages' component={Messages} />
        <Route path='/mobileApp' component={MobileApp} />
        <Route path='/tax' component={Tax} />
        <Route path='/fees' component={Fees} />
    </Switch>
)

export default RootRouter
