import React from 'react'
import { Route } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Friends from '../components/Friends'
import CodeApp from '../components/CodeApp'
import Project from '../components/Project'

export default class PairmotelyContainer extends React.Component{
  constructor(){
    super()

    this.state = {
      projects: [],
      users: []
    }
  }

  componentWillMount(){
    if(!sessionStorage.getItem('Authorization'))
    {
      return this.props.history.push('/login')
    }
  }

  componentDidMount(){
    return fetch('http://localhost:3000/users')
    .then( res => res.json() )
    .then( data => this.setState({
      users: data
    }))
  }

  logOut(){
    sessionStorage.clear()
    this.props.history.push('/login')
  }

  render(){
    return(
      <div>
        <NavBar />
        <div className="container">
          <h2>Welcome {sessionStorage.User}</h2>
          <button onClick={ () => this.logOut() }>Log Out</button>
        </div>
        <Route exact path="/home/newproject" render={ () => <Project /> } />
        <Route exact path="/home/friends" render={ () => <Friends users={this.state.users}/> } />
      </div>
    )
  }

}
