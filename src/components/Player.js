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
      <div className={`row position-${this.state.playerSeat}`}>
        <p className='player-stats'> {this.state.playerSeat} </p>
        <p className='player-stats'> {this.state.playerName}</p>
        <p className='player-stats'> chips: {this.state.playerChips} </p>

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
        reveal= { () => this.props.reveal() }
        phase={this.props.phase}
      />

      </div>
    )
  }
}
