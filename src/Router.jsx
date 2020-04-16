import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Dashboard from './components/dashboard/Dashboard'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import Users from './components/users/Users'
import Deps from './components/deps/Deps'
import Sites from './components/sites/Sites'
import JobBoard from './components/jobs/JobBoard'
import CreateJob from './components/jobs/CreateJob'
import Settings from './components/settings/SettingsScreen'

import Messages from './components/messages/MessageScreen'
import Tax from './components/tax/Tax'
import Fees from './components/fees/Fees'

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

        <Route path='/messages' component={Messages} />
        <Route path='/tax' component={Tax} />
        <Route path='/fees' component={Fees} />
    </Switch>
)

export default RootRouter
