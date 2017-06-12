import React from 'react'
import Player from '../components/Player'
import styles from '../css/Board.css'


export default class BoardContainer extends React.Component{
  //cards are being passed in shuffled as props
  constructor(props){
    super(props)


    this.state = {
      currentDeck: [],
      board: [],
      dealt: false,
      playerHand: [],
      pot: 0,
      phase: "pre-flop"
    }
  }

  createPlayerHand(currentDeck){
    let playerCardArr = []
    let numOfPlayers = this.props.players.length

    while(numOfPlayers > 0){
      let array = []
      array.push(currentDeck.shift())
      array.push(currentDeck.shift())
      playerCardArr.push(array)
      numOfPlayers -= 1
    }
    debugger
    this.setState({
      currentDeck: currentDeck,
      playerHand: playerCardArr,
      dealt: true
    })

  }


  dealFlop(){
    let currentDeck = this.state.currentDeck
    let flop = []
    flop.push(currentDeck.shift())
    flop.push(currentDeck.shift())
    flop.push(currentDeck.shift())
    this.setState({
      currentDeck: currentDeck,
      board: flop
    })
  }

  dealToPlayers(){
    let currentDeck = this.props.cards
    this.createPlayerHand(currentDeck)
  }

  nextCard(){
    if(this.state.board.length === 0){
      this.dealFlop()
    }else if(this.state.board.length < 5){
      let currentDeck = this.state.currentDeck
      let anotherCard = currentDeck.shift()
      let board = this.state.board.concat( anotherCard )
      this.setState({
        currentDeck: currentDeck,
        board: board
      })
    }else{
      this.props.shuffle()
    }
  }


  fold(){
    this.setState({
      playerHand: []
    })
  }

  bet(value){
    const updatePot = parseInt(this.state.pot) + parseInt(value)
    this.setState({ pot: updatePot })
    this.nextCard()

  }

  render(){
    if(this.state.dealt){
      let showCards
      if(this.state.board.length > 0){
        showCards = this.state.board.map( (el,index) => <img key={index} className="card" src={el.image} alt="boohoo" width="100" height="120"/> )
      }
      let hands = []
      this.state.playerHand.forEach( (hand, idx) => {
        this.props.players.map( (player, index) => {
          if (idx === index){
            hands.push(
              <Player
                position={index + 1}
                key={player.username}
                player={player}
                board={this.state.board}
                hand={hand}
                nextCard={ () => this.nextCard() }
                fold={ () => this.fold() }
                bet={ (value) => this.bet(value) }
              />
            )
            console.log(player)
          }
        }
      )

    })

    console.log(hands)
    return(
      <div className="full-board animated fadeIn">
        <div className="center-board ">

          {showCards ? showCards : null}
          <h4 className="board-text pot">Pot: {this.state.pot}</h4>
        </div>

        {hands}
      </div>
    )
  }else{

    return(
      <div className="homepage">
        <div className="row">

        </div>
        <div className="row">

        </div>
        <div className="row">

        </div>

        <button className="btn-lg btn-default" onClick={() => this.dealToPlayers() }>Deal!</button>
      </div>
    )
  }
}



}
