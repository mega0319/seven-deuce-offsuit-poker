import React from 'react'
import PlayerHand from './PlayerHand'

export default class Player extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      playerName: props.player.username,
      playerChips: props.player.play_chips,
      playerSeat: props.position,
      currentHand: props.hand
    }
  }

  updatePlayChips(betAmount){
    const chips = parseInt(this.state.playerChips) - parseInt(betAmount)
    this.setState({ playerChips: chips })
  }

  render(){


    return(
      <div className={`position-${this.state.playerSeat}`}>
        <h4>PlayerSeat: {this.state.playerSeat}</h4>
        <h4>Playername: {this.state.playerName}</h4>
        <h4>Chips: {this.state.playerChips} </h4>

      <PlayerHand
        position={this.state.playerSeat}
        key={this.props.player.username}
        player={this.props.player.username}
        board={this.props.board}
        hand={this.props.hand}
        nextCard={ () => this.props.nextCard() }
        fold={ () => this.props.fold() }
        bet={ (value) => this.props.bet(value) }
        updatePlayChips = { (betAmount) => this.updatePlayChips(betAmount) }
      />

      </div>
    )
  }
}
