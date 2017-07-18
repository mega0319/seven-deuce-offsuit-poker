import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import CreateUser from './CreateUser'
import LoginForm from './LoginForm'
import SevenTwoOhContainer from '../containers/SevenTwoOhContainer'
import styles from '../css/App.css'

export default class App extends React.Component{
  
  render(){

    return (
      <div>
        <Router>
          {/* <Redirect to="/login" /> */}
          <Switch>
            <Route path="/home" render={() => <SevenTwoOhContainer cableApp={this.props.cableApp}/>}/>
            <Route exact path="/login" component={LoginForm}/>
            <Route exact path="/create" component={CreateUser} />
          </Switch>
        </Router>
      </div>
    )
  }
}
