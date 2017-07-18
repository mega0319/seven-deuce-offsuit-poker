import React from 'react'
import PlayerHand from './PlayerHand'

export default class Player extends React.Component{
  constructor(props){
    super(props)

    this.state = { playerChips: props.player.play_chips }
  }

  componentDidMount(){
    return fetch(`http://${window.location.hostname}:3000/users/${this.props.player.id}`)
    .then( res => res.json() )
    .then( data => this.setState({ playerChips: data.play_chips}) )
  }

  updatePlayChips(betAmount){
    const chips = parseInt(this.state.playerChips, 10) - parseInt(betAmount, 10)
    this.userPatchRequest(chips)
  }

  handleCall(playerName){
    const chips = parseInt(this.state.playerChips, 10) - parseInt(this.props.currentBet, 10)
    this.userPatchRequest(chips)
    this.props.call(playerName)
  }

  userPatchRequest(chips){
    return fetch(`http://${window.location.hostname}:3000/users/${this.props.player.id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify( {user: {play_chips: chips} } )
      })
      .then( res => res.json() )
      .then( data => this.setState({
        playerChips: data.play_chips
      }) )

    }

  render(){


    if (this.props.position === this.props.currentPlayerPos){
    return(
        <div className={` row position-${this.props.position}`}>
          {this.props.dealer === this.props.position ? <img className="dlr-btn animated fadeIn" src={require('../images/btn.svg')} alt="" width="60" height="60"/> : null}
          {/* <p className='player-stats'> {this.props.position} </p> */}
          <p className='player-now animated flash player-stats'> {this.props.player.username}</p>
          <p className='player-stats'> chips: {this.state.playerChips} </p>


          <PlayerHand
            position={this.props.position}
            currentPlayerPos={this.props.currentPlayerPos}
            handlePlayerAction={this.props.handlePlayerAction}
            key={this.props.player.id}
            player={this.props.player.username}
            board={this.props.board}
            hand={this.props.hand}
            chips={this.state.playerChips}
            nextCard={ () => this.props.nextCard() }
            fold={ (playerName) => this.props.fold(playerName) }
            bet={ (value, playerName, raise) => this.props.bet(value,playerName, raise) }
            updatePlayChips = { (betAmount) => this.updatePlayChips(betAmount) }
            reveal= { () => this.props.reveal() }
            phase={this.props.phase}
            redeal={() => this.props.redeal()}
            foldedPlayers={this.props.foldedPlayers}
            folded={this.props.folded}
            currentBet={this.props.currentBet}
            call={(playerName) => this.handleCall(playerName) }
          />
        </div>
      )
      }else{
        return (
      <div className={`row position-${this.props.position}`}>
        {this.props.dealer === this.props.position ? <img className="dlr-btn animated fadeIn" src={require('../images/btn.svg')} alt="" width="60" height="60"/> : null}
        <p className='player-stats'> {this.props.player.username}</p>
        <p className='player-stats'> chips: {this.state.playerChips} </p>

        <PlayerHand
          position={this.props.position}
          currentPlayerPos={this.props.currentPlayerPos}
          handlePlayerAction={(playerName) => this.props.handlePlayerAction(playerName)}
          key={this.props.player.id}
          player={this.props.player.username}
          board={this.props.board}
          hand={this.props.hand}
          chips={this.state.playerChips}
          nextCard={ () => this.props.nextCard() }
          fold={ (playerName) => this.props.fold(playerName) }
          bet={ (value, playerName, raise) => this.props.bet(value,playerName, raise) }
          updatePlayChips = { (betAmount) => this.updatePlayChips(betAmount) }
          reveal= { () => this.props.reveal() }
          phase={this.props.phase}
          redeal={() => this.props.redeal()}
          foldedPlayers={this.props.foldedPlayers}
          folded={this.props.folded}
          currentBet={this.props.currentBet}
          call={(playerName) => this.handleCall(playerName) }
        />
      </div>
    )
    }

  }
}
