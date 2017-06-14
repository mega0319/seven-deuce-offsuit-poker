import React from 'react'
import Player from '../components/Player'
import styles from '../css/Board.css'


export default class BoardContainer extends React.Component{
  constructor(props){
    super(props)


    this.state = {
      tableName: '',
      deckID: '',
      board: [],
      players: [],
      playerHand: [],
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
    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then( res => res.json() )
    .then( data => this.setState({
      deckID: data.deck_id
    }))
  }

  drawCard(num){
    return fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=${num}`)
    .then( res => res.json() )
  }

  shuffleCards(){
    return fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckID}/shuffle/`)
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
    this.shuffleCards()
    .then( () => this.createPlayerHand() )
  }

  createPlayerHand(){
    let newPlayerObjArr
    let arrayOfCards
    let num = parseInt(this.state.players.length) * 2
    this.drawCard(num)
    .then( data => arrayOfCards = data.cards)
    .then( () => {
      newPlayerObjArr = this.state.players.map( (player, idx) => {
        return { playerName: player.username, hand: arrayOfCards.splice(0,2) }
      })
      debugger
    })
    // this.createTableRequest(newPlayerObjArr)
    .then( () => this.setState( { playerHand: newPlayerObjArr, dealt: true } ) )
  }

  createTableRequest(newPlayerObjArr){
    let playerIDs = this.state.players.map( player => player.id )
    return fetch('http://localhost:3000/poker_tables', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(
        {poker_table:
          {
            name: this.state.tableName,
            creator_id: sessionStorage.getItem("user_id"),
            board_cards: '',
            turns: 0,
            pot: 0,
            dealer_button_position: 1,
            small_blind: 5,
            big_blind: 10,
            current_turn_position: 1,
          },user_updates:
          {
            user_id: playerIDs,
            hands: newPlayerObjArr
          }
        })
      }).then(res => res.json() )
      .then(console.log)
    }


    dealFlop(){
      let flop
      this.drawCard(3)
      .then( (data) => flop = data.cards )
      .then( () => this.setState( { board: flop, phase: "flop" } ) )
    }

    dealToPlayers(){
      this.createPlayerHand()
    }

    nextCard(handSolve){
      debugger
      if(this.state.board.length === 0){
        this.dealFlop()
      }else if(this.state.board.length < 4){
        let anotherCard
        let board
        this.drawCard(1)
        .then( (data) => anotherCard = data.cards[0])
        .then( () => board = this.state.board.concat( anotherCard ) )
        .then( () => this.setState( { board: board, phase: "turn" } ) )
      }else if(this.state.board.length === 4){
        let anotherCard
        let board
        this.drawCard(1)
        .then( (data) => anotherCard = data.cards[0])
        .then( () => board = this.state.board.concat( anotherCard ) )
        .then( () => this.setState( { board: board, phase: "river" } ) )
      }else{
        console.log("card", handSolve)
        this.sortAndDeclareWinner()
      }
    }

    sortIntoCodes(arrayOfCardObj){
      return arrayOfCardObj.map( cardObj => cardObj.code )
    }

    sortAndDeclareWinner(){
      let arrayOfScoreObj = this.state.playerHand.map( playerHandObj => {
        let board = this.state.board
        let fullHandObj = board.concat(playerHandObj.hand)
        let fullHandCodes = this.sortIntoCodes(fullHandObj)
        let solved = this.solveHand(fullHandCodes)
        let score = solved[0]
        let hand = solved.slice(1)
        return {playerName: playerHandObj.playerName, score: score, hand: hand  }
      })
      let winnerAndLosers = arrayOfScoreObj.sort( (a, b) => {
        return b["score"] - a["score"]
      })
      this.setState({
        winner: winnerAndLosers[0].playerName,
        winningHand: winnerAndLosers[0].hand,
        phase: "round-end"
      })
    }

    bet(value){
      const updatePot = parseInt(this.state.pot) + parseInt(value)
      this.setState({ pot: updatePot })
      this.nextCard()
    }

    solveHand(fullHand){
      //example for fullHand = ["2D", "QH", "6C", "9D", "6S", "0C"]
      const cardRanks = {
        "2" : 2,
        "3" : 3,
        "4" : 4,
        "5" : 5,
        "6" : 6,
        "7" : 7,
        "8" : 8,
        "9" : 9,
        "0" : 10,
        "J" : 11,
        "Q" : 12,
        "K" : 13,
        "A" : 14
      }
      const sortedHand = fullHand.sort( (firstCard, secondCard) => {
        return cardRanks[secondCard[0]] - cardRanks[firstCard[0]]
      })

      const reverseSortedHand = fullHand.sort( (firstCard, secondCard) => {
        return cardRanks[firstCard[0]] - cardRanks[secondCard[0]]
      })

      const preStraightSort = reverseSortedHand.map( card => cardRanks[card.slice(0,1)] )
      const straightSort = this.unique(preStraightSort)
      console.log("AFTER SORTING ARRAY", straightSort)
      const flushCards = this.findFlush(sortedHand)
      const straight = this.findStraight(straightSort)
      console.log("AFTER FIND STRAIGHT", straight)
      const results = this.findPairsOrTripsOrQuads(sortedHand)
      const pairsArray = results[0]
      const tripsArray = results[1]
      const quadsArray = results[2]

      if(flushCards.length > 0 && straight){
        return `9STRAIGHT FLUSH`

      }else if(quadsArray.length > 0){
        return `8Four of a kind ${quadsArray[0]}s`.replace(/0/g , "Ten").replace(/J/g, "Jack").replace(/Q/g, "Queen").replace(/K/g, "King").replace(/A/g, "Ace")

      }else if(tripsArray.length >= 1 && pairsArray.length >= 1){
        return `7Full house ${tripsArray[0]}s full of ${pairsArray[0]}s`.replace(/0/g , "Ten").replace(/J/g, "Jack").replace(/Q/g, "Queen").replace(/K/g, "King").replace(/A/g, "Ace")

      }else if(flushCards.length > 0){
        return `6${flushCards[flushCards.length - 1][0]} high flush`.replace(/0/g , "Ten").replace(/J/g, "Jack").replace(/Q/g, "Queen").replace(/K/g, "King").replace(/A/g, "Ace")

      }else if(straight){
        return `5${straight}`.replace(/10/g, "Ten").replace(/11/g, "Jack").replace(/12/g, "Queen").replace(/13/g, "King").replace(/14/g, "Ace")

      }else if(tripsArray.length >= 1){
        return `4Three of a kind ${tripsArray[0]}s`.replace(/0/g , "Ten").replace(/J/g, "Jack").replace(/Q/g, "Queen").replace(/K/g, "King").replace(/A/g, "Ace")

      }else if(pairsArray.length >= 2){
        return `3Two pairs ${pairsArray[pairsArray.length - 1]}s and ${pairsArray[0]}s`.replace(/0/g , "Ten").replace(/J/g, "Jack").replace(/Q/g, "Queen").replace(/K/g, "King").replace(/A/g, "Ace")

      }else if(pairsArray.length >= 1){
        return `2Pair of ${pairsArray[0]}s`.replace(/0/g , "Ten").replace(/J/g, "Jack").replace(/Q/g, "Queen").replace(/K/g, "King").replace(/A/g, "Ace")

      }else{
        return `1${sortedHand[sortedHand.length - 1][0]} high`.replace(/0/g , "Ten").replace(/J/g, "Jack").replace(/Q/g, "Queen").replace(/K/g, "King").replace(/A/g, "Ace")

      }
    }

    unique(handArray) {
    var seen = {}
    return handArray.filter( hand => {
      if (seen[hand])
        return
      seen[hand] = true
      return hand
    })
  }

    findPairsOrTripsOrQuads(handArray){

      const object = {};
      const pairs = [];
      const trips = [];
      const quads = [];

      handArray.forEach( card => {
        if(!object[card[0]])
        object[card[0]] = 0;
        object[card[0]] += 1;
      })

      for (const cardValue in object) {
        if(object[cardValue] === 2) {
          pairs.push(cardValue);
        }else if(object[cardValue] === 3){
          trips.push(cardValue)
        }else if(object[cardValue] === 4){
          quads.push(cardValue)
        }
      }
      return [pairs, trips, quads]
    }

    findStraight(array) {
      if (array[4] - array[0] === 4){
        return `Straight ${array[0]} to ${array[4]}`
      }else if (array[5] - array[1] === 4){
        return `Straight ${array[1]} to ${array[5]}`
      }else if (array[6] - array[2] === 4){
        return `Straight ${array[2]} to ${array[6]}`
      }else{
        return false
      }
    }

    findFlush(handArray){
      const object = {}
      const flushCards = []
      let flushSuit = ''

      handArray.forEach( card => {
        if (!object[card[1]])
        object[card[1]] = 0
        object[card[1]] += 1
      })
      for (const cardValue in object) {
        if(object[cardValue] === 5) {
          flushSuit = cardValue
        }
      }
      handArray.forEach( card => {
        if (card[1] === flushSuit)
        flushCards.push(card)
      })
      return flushCards
    }

    handPoints(points){
      let handPoints = parseInt(points)
      debugger
      let handPlayerObj = { player: this.props.player, points: handPoints }
      this.props.reveal(handPlayerObj)
      debugger
    }

    render(){
      if(this.state.dealt && this.state.deckID){
        let showCards
        if(this.state.board.length > 0){
          showCards = this.state.board.map( (el,index) => <img key={index} className="card animated slideInDown" src={el.image} alt="boohoo" width="100" height="120"/> )
        }
        let hands = []
        this.state.playerHand.forEach( (handInfo, idx) => {
          this.state.players.map( (player, index) => {
            if (handInfo.playerName === player.username){
              hands.push(
                <Player
                  position={index + 1}
                  key={player.username}
                  player={player}
                  board={this.state.board}
                  hand={handInfo.hand}
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
            <p className="board-text">{this.state.phase}</p>
            {showCards ? showCards : null}
            {this.state.phase === "round-end" ? <h4 className="board-text"> {this.state.winner} wins with {this.state.winningHand} </h4> : null}
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
