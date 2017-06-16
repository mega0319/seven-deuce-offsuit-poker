import React from 'react'
import NavBar from './NavBar'

export default class AllGames extends React.Component{
  constructor(){
    super()

    this.state ={
      games: []
    }
  }


  componentDidMount(){
    return fetch('http://localhost:3000/poker_tables')
    .then(res => res.json() )
    .then(data => this.setState({ games: data }))
  }

  render(){
    let allGames = this.state.games.map( game => <li> <a href={`/home/pokertables/${game.id}`}>  {game.id} </a></li>)

    return(

      <div className="find-games">
        <NavBar />
        <ul>
          {allGames}
        </ul>
      </div>
    )
  }
}
