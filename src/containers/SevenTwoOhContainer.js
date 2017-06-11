import React from 'react'
import { Route } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Friends from '../components/Friends'
import Game from '../components/Game'

export default class SevenTwoOhContainer extends React.Component{
  constructor(){
    super()

    this.state = {
      cards: [],
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
    return fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
    .then( res => res.json() )
    .then( data => this.setState({
      cards: data.cards
    }))
  }

  logOut(){
    sessionStorage.clear()
    this.props.history.push('/login')
  }

  render(){
    return(
      <div>
        <NavBar logOut={() => this.logOut() }/>
        <div className="container-fluid">

        </div>
        <Route exact path="/home/newgame" render={ () => <Game cards={this.state.cards}/> } />
        <Route exact path="/home/friends" render={ () => <Friends users={this.state.users}/> } />
      </div>
    )
  }

}
