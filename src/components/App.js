import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import CreateUser from './CreateUser'
import LoginForm from './LoginForm'
import SevenTwoOhContainer from '../containers/SevenTwoOhContainer'
import styles from '../css/App.css'

export default function App(){

  return (
    <div>
      <Router>
        <Switch>
          <Route path="/home" component={SevenTwoOhContainer}/>
          <Route exact path="/login" component={LoginForm}/>
          <Route exact path="/create" component={CreateUser} />
          {/* <Route exact path="/newgame" component={CodeApp} /> */}
        </Switch>
      </Router>
    </div>
  )
}
