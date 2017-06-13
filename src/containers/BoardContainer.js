import React from 'react'
import Player from '../components/Player'
import styles from '../css/Board.css'


export default class BoardContainer extends React.Component{
  constructor(props){
    super(props)


    this.state = {
      tableName: '',
      currentDeck: [],
      board: [],
      players: [],
      playerHand: [],
      sortedFinalHands: [],
      smallBlind: 5,
      bigBlind: 10,
      dealerButtonPosition: 1,
      dealt: false,
      phase: "pre-flop",
      pot: 0,
      winner: '',
      winningHand: ''
    }
  }

  componentDidMount(){
    this.getCards()
    this.getUsers()
  }

  getUsers(){
    return fetch('http://localhost:3000/users')
    .then( res => res.json() )
    .then( data => this.setState({
      players: data
    }))
  }

  getCards(){
    return fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
    .then( res => res.json() )
    .then( data => this.setState({
      currentDeck: data.cards
    }))
  }

  fisherYatesShuffle(cards){
    let m = cards.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = cards[m];
      cards[m] = cards[i];
      cards[i] = t;
    }
    return cards;
  }

  handleReshuffle(){
    this.getCards()
    .then( data => this.fisherYatesShuffle(this.state.currentDeck) )
    .then( () => this.createPlayerHand(this.state.currentDeck) )
  }

  createPlayerHand(currentDeck){
    let playerCardArr = []
    let numOfPlayers = this.state.players.length

    while(numOfPlayers > 0){
      let array = []
      array.push(currentDeck.shift())
      array.push(currentDeck.shift())
      playerCardArr.push(array)
      numOfPlayers -= 1
    }
    this.createTableRequest()
    this.setState({
      currentDeck: currentDeck,
      playerHand: playerCardArr,
      dealt: true
    })

  }

  createTableRequest(){
    return fetch('http://localhost:3000/poker_tables', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify( {poker_table:
      {
        name: "TABLE ONE",
        creator_id: sessionStorage.getItem("user_id"),
        board_cards: '',
        turns: 0,
        pot: 0,
        dealer_button_position: 1,
        small_blind: 5,
        big_blind: 10,
        current_turn_position: 1,
        user_id: sessionStorage.getItem("user_id")
      }})
    }).then(res => res.json() )
    .then(console.log)
  }


  dealFlop(){
    let currentDeck = this.state.currentDeck
    let flop = []
    flop.push(currentDeck.shift())
    flop.push(currentDeck.shift())
    flop.push(currentDeck.shift())
    this.setState({
      currentDeck: currentDeck,
      board: flop,
      phase: "flop"
    })
  }

  dealToPlayers(){
    this.createPlayerHand(this.state.currentDeck)
  }

  nextCard(handSolve){
    debugger
    if(this.state.board.length === 0){
      this.dealFlop()
    }else if(this.state.board.length < 4){
      let currentDeck = this.state.currentDeck
      let anotherCard = currentDeck.shift()
      let board = this.state.board.concat( anotherCard )
      this.setState({
        currentDeck: currentDeck,
        board: board,
        phase: "turn"
      })
    }else if(this.state.board.length === 4){
      let currentDeck = this.state.currentDeck
      let anotherCard = currentDeck.shift()
      let board = this.state.board.concat( anotherCard )
      this.setState({
        currentDeck: currentDeck,
        board: board,
        phase: "river"
      })
    }else{
      console.log("card", handSolve)
      this.sortAndDeclareWinner()
    }
  }

  findWinningHand(playerHandObj){
    let array = this.state.sortedFinalHands.concat(playerHandObj)
    console.log("array here", playerHandObj)
    this.setState({
      sortedFinalHands: array,
      phase: "post-river"
    })
  }

  sortAndDeclareWinner(){
    //INCOMPLETE FUNCTION!!!!
    let hands = this.state.sortedFinalHands.sort( (a, b) => {
      return b.points - a.points
    })
    // debugger
    // this.setState({
    //   winner: hands[0].player,
    //   phase: "river"
    // })
  }

  bet(value){
    const updatePot = parseInt(this.state.pot) + parseInt(value)
    this.setState({ pot: updatePot })
    this.nextCard()
  }

  render(){
    if(this.state.dealt && this.state.currentDeck.length > 0){
      let showCards
      console.log("hello",this.state.sortedFinalHands)
      if(this.state.board.length > 0){
        showCards = this.state.board.map( (el,index) => <img key={index} className="card animated slideInDown" src={el.image} alt="boohoo" width="100" height="120"/> )
      }
      let hands = []
      this.state.playerHand.forEach( (hand, idx) => {
        this.state.players.map( (player, index) => {
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
                reveal={ (playerHandObj) => this.findWinningHand(playerHandObj)}
                phase={this.state.phase}
              />
            )
          }
        }
      )

    })

    return(
      <div className="full-board animated fadeIn">
        <div className="center-board ">

          {showCards ? showCards : null}
          {this.state.phase === "river" ? <p> {this.state.winner} </p> : null}
          <h4 className="board-text pot">Pot: {this.state.pot}</h4>
        </div>

        {hands}
      </div>
    )
  }else{

    return(
      <div className="homepage">

        <button className="btn-lg btn-default" onClick={() => this.dealToPlayers() }>Deal!</button>
        
      </div>
    )
  }
}
}
