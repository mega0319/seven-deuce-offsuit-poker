import React from 'react'
import PlayerHand from '../components/PlayerHand'

export default class BoardContainer extends React.Component{
  //cards are being passed in shuffled as props
  constructor(props){
    super(props)


    this.state = {
      currentDeck: [],
      board: [],
      dealt: false,
      playerHand: []
    }
  }

  playerHandCards(){

  }

  createPlayerHand(currentDeck){
    let playerCardArr = []
    playerCardArr.push(currentDeck.shift())
    playerCardArr.push(currentDeck.shift())
    // debugger
    this.setState({
      currentDeck: currentDeck,
      playerHand: playerCardArr
    })

  }

  dealCards(){
  let currentDeck = this.props.cards
  let flop = []
    flop.push(currentDeck.shift())
    flop.push(currentDeck.shift())
    flop.push(currentDeck.shift())
  this.setState({
    currentDeck: currentDeck,
    board: flop,
    dealt: true
  })
  this.createPlayerHand(currentDeck)
  }

  nextCard(){
    if(this.state.board.length < 5){
    let currentDeck = this.state.currentDeck
    let river = currentDeck.shift()
    let board = this.state.board.concat( river )
    // debugger
    this.setState({
      currentDeck: currentDeck,
      board: board
    })
  }
  }

  fold(){
    this.setState({
      playerHand: []
    })
  }


  render(){
  if(this.state.dealt){

  let showCards = this.state.board.map( (el,index) => <img key={index} className="card" src={el.image} alt="boohoo" width="100" height="120"/> )

    return(
      <div>
        {showCards}
        <h4>Your Hand</h4>
        <PlayerHand hand={this.state.playerHand} nextCard={this.nextCard.bind(this) } fold={this.fold.bind(this)}/>
      </div>
    )
  }else{

      return(
        <div>
          <button onClick={() => this.dealCards() }>Deal!</button>
        </div>
      )
  }
  }



}
