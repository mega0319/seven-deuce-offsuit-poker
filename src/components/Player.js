import React from 'react'
import PlayerHand from './PlayerHand'

export default class Player extends React.Component{
  constructor(props){
    super(props)

    this.state = { playerChips: props.player.play_chips + props.winnings }
  }

  updatePlayChips(betAmount){
    const chips = parseInt(this.state.playerChips) - parseInt(betAmount)
    this.setState({ playerChips: chips })
  }

  render(){


    return(
      <div className={`row position-${this.props.position}`}>
        <p className='player-stats'> {this.props.position} </p>
        <p className='player-stats'> {this.props.player.username}</p>
        <p className='player-stats'> chips: {this.state.playerChips} </p>

        <PlayerHand
          position={this.props.position}
          currentPlayerPos={this.props.currentPlayerPos}
          handlePlayerAction={() => this.props.handlePlayerAction()}
          key={this.props.player.username}
          player={this.props.player.username}
          board={this.props.board}
          hand={this.props.hand}
          nextCard={ () => this.props.nextCard() }
          fold={ (playerName) => this.props.fold(playerName) }
          bet={ (value) => this.props.bet(value) }
          updatePlayChips = { (betAmount) => this.updatePlayChips(betAmount) }
          reveal= { () => this.props.reveal() }
          phase={this.props.phase}
          redeal={() => this.props.redeal()}
          foldedPlayers={this.props.foldedPlayers}
          folded={this.props.folded}
        />
      </div>
    )
  }
}
