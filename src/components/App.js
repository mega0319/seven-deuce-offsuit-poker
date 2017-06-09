import React from 'react'
import CodeApp from './CodeApp'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import CreateUser from './CreateUser'
import LoginForm from './LoginForm'
import PairmotelyContainer from '../containers/PairmotelyContainer'

export default function App(){

  return (
    <div>
      <Router>
        <Switch>
          <Route path="/home" component={PairmotelyContainer}/>
          <Route exact path="/login" component={LoginForm}/>
          <Route exact path="/create" component={CreateUser} />
          <Route exact path="/newproject" component={CodeApp} />
        </Switch>
      </Router>
    </div>
  )
}
