import React from 'react'

export default class AllGames extends React.Component{
  constructor(){
    super()

    this.state ={
      games: []
    }
  }

  componentDidMount(){
    return fetch(`http://${window.location.hostname}:3000/poker_tables`)
    .then(res => res.json() )
    .then(data => this.setState({ games: data }))
  }

  render(){

    let allGames = this.state.games.map( game =>  {
      return (
        <div key={game.id} className="animated slideInLeft panel panel-danger">
          <div className="panel-heading">
            <h3 className="panel-title">{game.name}</h3>
          </div>
          <div className="panel-body">
            BIG BLINDS: {game.big_blind} <br/>
            SMALL BLINDS: {game.small_blind} <br/>
            <a key={game.id} className="btn btn-default" href={`/home/pokertables/${game.id}`}>  JOIN TABLE #{game.id} </a>
          </div>
        </div>
      )
    })
    let finalGames = allGames
    return(

      <div className="all-games-padding find-games">
        <h3 className="board-text">Select a Game</h3>
        {finalGames}
      </div>
    )
  }
}
