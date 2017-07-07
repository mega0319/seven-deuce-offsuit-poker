import React from 'react'
import Player from '../components/Player'
import styles from '../css/Board.css'
import MessageBox from '../components/MessageBox'

export default class BoardContainer extends React.Component{
  constructor(props){
    super(props)


    this.state = {
      tableName: '',
      tableID: '',
      deckID: '',
      board: [],
      players: [],
      playerHand: [],
      activePlayers: [],
      foldedPlayers: [],
      smallBlind: 100,
      bigBlind: 200,
      dealerButtonPosition: 1,
      dealt: false,
      phase: "pre-flop",
      currentBet: 0,
      bettorPosition: 0,
      pot: 0,
      currentPlayerPos: 2,
      winner: '',
      winningHand: '',
      message: '',
      playersLoggedIn: []
    }
  }

  componentDidMount(){
    if (this.props.started){
      this.updatePlayerTable()

      this.props.cableApp.pokertablechannel =
      this.props.cableApp.cable.subscriptions.create('PokerTableChannel',
      {
        received: (cableData) => {
          this.setState( {
            board: cableData.board,
            players: cableData.players,
            playerHand: cableData.player_hand,
            activePlayers: cableData.active_players,
            foldedPlayers: cableData.folded_players,
            smallBlind: cableData.small_blind,
            bigBlind: cableData.big_blind,
            deckID: cableData.deck_id,
            tableName: cableData.name,
            tableID: cableData.id,
            dealerButtonPosition: cableData.dealer_button_position,
            dealt: cableData.dealt,
            phase: cableData.phase,
            currentBet: cableData.current_bet,
            bettorPosition: cableData.bettor_position,
            pot: cableData.pot,
            currentPlayerPos: cableData.current_turn_position,
            winner: cableData.winner,
            winningHand: cableData.winning_hand,
            playersLoggedIn: this.state.playersLoggedIn,
            message: cableData.message
          })
        },

        connected: () => {
          console.log("CONNECTED")
          this.getCards()
          .then(() =>
            this.setState({ message: `${sessionStorage.getItem("User")} has joined!` }, () => this.updateTable() )
          )
        }
      })
      this.loggedIn()


    }else{
      console.log("NOT STARTED")
      this.loggedIn()
      this.getCards()
      .then( () => this.createTableRequest() )
      .then( () => this.updatePlayerTable() )
    }
  }

  updatePlayerTable(){
    let id = parseInt(sessionStorage.getItem("user_id"), 10)
    let table = this.state.tableID || parseInt(this.props.match.url.slice(-4), 10)
    return fetch(`http://${window.location.hostname}:3000/users/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "PATCH",
      body: JSON.stringify({
        user:
        {
          current_table: table
        }
      })
    })
    .then( res => res.json() )
    .then( this.setState({ tableID: table }))
  }

  getUsers(tableID){
    console.log("IN GET USERS")
    console.log("TABLEID", this.state.tableID)
    return fetch(`http://${window.location.hostname}:3000/users/?pokertable_id=${tableID}`)
    .then( res => res.json() )
    .then( data => this.setState({
      players: this.state.players.includes(data) ? this.state.players : this.state.players.concat(data)
    }))
  }

  loggedIn(){
    let id = this.state.playersLoggedIn.concat(parseInt(sessionStorage.getItem("user_id"), 10))
    this.setState({
      playersLoggedIn: id
    })
    // this.updateTable()
  }

  getCards(){

    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then( res => res.json() )
    .then( data => this.setState({
      deckID: data.deck_id
    }))

    console.log("in getCards", this.state.deckID)// this.updateTable()
  }

  drawCard(num){
    return fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=${num}`)
    .then( res => res.json() )
  }

  shuffleCards(){
    return fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckID}/shuffle/`)
  }

  updateTable(){
    this.props.cableApp.pokertablechannel.send(
      {poker_table:
        {

          board: this.state.board,
          players: this.state.players,
          player_hand: this.state.playerHand,
          active_players: this.state.activePlayers,
          folded_players: this.state.foldedPlayers,
          small_blind: this.state.smallBlind,
          big_blind: this.state.bigBlind,
          deck_id: this.state.deckID,
          table_id: this.state.tableID,
          name: this.state.tableName,
          dealer_button_position: this.state.dealerButtonPosition,
          dealt: this.state.dealt,
          phase: this.state.phase,
          current_bet: this.state.currentBet,
          bettor_position: this.state.bettorPosition,
          pot: this.state.pot,
          current_turn_position: this.state.currentPlayerPos,
          winner: this.state.winner,
          winning_hand: this.state.winningHand,
          players_logged_in: this.state.playersLoggedIn,
          message: this.state.message
        },
        user_updates: {
          id: this.state.tableID
        }
      }
    )
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
    this.getUsers(this.state.tableID)
    .then( () => {
      console.log("STATE INSIDE PLAYERHAND", this.state)
      let dealerIndex = this.state.dealerButtonPosition - 1
      let firstHalfPlayers = this.state.players.slice(dealerIndex + 1, this.state.players.length)
      let secondHalfPlayers = this.state.players.slice(0, dealerIndex + 1)
      let players = firstHalfPlayers.concat(secondHalfPlayers)

      let newPlayerObjArr
      let arrayOfCards
      let num = parseInt(this.state.players.length, 10) * 2
      this.drawCard(num)
      .then( data => arrayOfCards = data.cards)
      .then( () => {
        newPlayerObjArr = this.state.players.map( (player, idx) => {
          return { players: players, playerName: player.username, hand: arrayOfCards.splice(0,2) }
        })
      })
      .then( () => this.setState( { playerHand: newPlayerObjArr, dealt: true }, () => this.updateTable() ) )
    })
  }

  createTableRequest(newPlayerObjArr){
    return fetch(`http://${window.location.hostname}:3000/poker_tables`, {
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
            board: this.state.board,
            turns: 0,
            pot: 0,
            dealer_button_position: 1,
            small_blind: 100,
            big_blind: 200,
            current_turn_position: 1,
          },
          user_updates:
          {
            user_id: this.state.playersLoggedIn,
            hands: newPlayerObjArr
          }
        })
      }).then(res => res.json() )
      .then(data => {
        this.setState( { tableID: data.id , tableName: data.name }, () => {
          this.props.cableApp.pokertablechannel =
          this.props.cableApp.cable.subscriptions.create('PokerTableChannel',
          {
            received: (cableData) => {
              console.log(cableData)
              this.setState( {
                board: cableData.board,
                players: cableData.players,
                playerHand: cableData.player_hand,
                activePlayers: cableData.active_players,
                foldedPlayers: cableData.folded_players,
                smallBlind: cableData.small_blind,
                bigBlind: cableData.big_blind,
                deckID: cableData.deck_id,
                tableName: cableData.name,
                tableID: cableData.id,
                dealerButtonPosition: cableData.dealer_button_position,
                dealt: cableData.dealt,
                phase: cableData.phase,
                currentBet: cableData.current_bet,
                bettorPosition: cableData.bettor_position,
                pot: cableData.pot,
                currentPlayerPos: cableData.current_turn_position,
                winner: cableData.winner,
                winningHand: cableData.winning_hand,
                message: cableData.message
              })
            }
          }
        )
      })
    })
  }

  dealFlop(){
    // let dealerIndex = this.state.dealerButtonPosition - 1
    // let firstHalfPlayers = this.state.players.slice(dealerIndex + 1, this.state.players.length)
    // let secondHalfPlayers = this.state.players.slice(0, dealerIndex + 1)
    // let players = firstHalfPlayers.concat(secondHalfPlayers)
    let flop
    this.drawCard(3)
    .then( (data) => flop = data.cards )
    .then( () => this.setState( { board: flop, phase: "flop", currentPlayerPos: this.playerPositioning(), currentBet: 0 , bettorPosition: 0} ) )
    .then( () => this.updateTable() )
  }

  dealToPlayers(){
    this.createPlayerHand()
  }

  playerPositioning(){
    let dealerIndex = this.state.dealerButtonPosition - 1
    let firstHalfPlayers = this.state.players.slice(dealerIndex + 1, this.state.players.length)
    let secondHalfPlayers = this.state.players.slice(0, dealerIndex + 1)
    let players = firstHalfPlayers.concat(secondHalfPlayers)

    let positions = players.map( (player, idx) => [player.username, idx + 1] )

    let activePlayers = positions.filter( (playerAndIndex) => !this.state.foldedPlayers.includes(playerAndIndex[0]) )

    let filteredActivePlayers = activePlayers.map ( playerAndIndex => playerAndIndex[1] )

    let index = filteredActivePlayers.indexOf(this.state.currentPlayerPos)

    if (index === filteredActivePlayers.length - 1){
      return filteredActivePlayers[0]
    }else{
      return filteredActivePlayers[index + 1]
    }
  }

  playerPArray(){
    let positions = this.state.players.map( (player, idx) => [player.username, idx + 1] )
    let activePlayers = positions.filter( (playerAndIndex) => !this.state.foldedPlayers.includes(playerAndIndex[0]) )
    return activePlayers.map ( playerAndIndex => playerAndIndex[1] )
  }

  nextHandPosition(){
    let dealerIndex = this.state.dealerButtonPosition - 1
    let firstHalfPlayers = this.state.players.slice(dealerIndex + 1, this.state.players.length)
    let secondHalfPlayers = this.state.players.slice(0, dealerIndex + 1)
    let players = firstHalfPlayers.concat(secondHalfPlayers)
  }



  nextCard(){
    if(this.state.board.length === 0){
      this.dealFlop()
    }else if(this.state.board.length < 4){
      let anotherCard
      let board
      this.drawCard(1)
      .then( (data) => anotherCard = data.cards[0])
      .then( () => board = this.state.board.concat( anotherCard ) )
      .then( () => this.setState( { board: board, phase: "turn", currentPlayerPos: this.playerPositioning(), currentBet: 0, bettorPosition: 0  } ) )
      .then( () => this.updateTable() )
    }else if(this.state.board.length === 4){
      let anotherCard
      let board
      this.drawCard(1)
      .then( (data) => anotherCard = data.cards[0])
      .then( () => board = this.state.board.concat( anotherCard ) )
      .then( () => this.setState( { board: board, phase: "river", currentPlayerPos: this.playerPositioning(), currentBet: 0, bettorPosition: 0 } ) )
      .then( () => this.updateTable() )
    }else{
      this.sortAndDeclareWinner()
    }
  }

  sortIntoCodes(arrayOfCardObj){
    return arrayOfCardObj.map( cardObj => cardObj.code )
  }


  winnerWinnerChickenDinner(winner){
    this.getUsers()
    let selectPlayer = this.state.players.filter( player => winner === player.username)
    let playerID = selectPlayer[0].id
    let playerChips

    fetch(`http://${window.location.hostname}:3000/users/${playerID}`)
    .then( res => res.json() )
    .then( data => playerChips = data.play_chips)
    .then( () => {
      let chips = this.state.pot + playerChips

      return fetch(`http://${window.location.hostname}:3000/users/${playerID}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify( {user: {play_chips: chips} } )
      })
    }
  )

}

sortAndDeclareWinner(){
  this.shuffleCards()
  console.log("folded", this.state.foldedPlayers)
  let arrayOfScoreObj = this.state.playerHand.map( playerHandObj => {
    if(!this.state.foldedPlayers.includes(playerHandObj.playerName)){
      let board = this.state.board
      let fullHandObj = board.concat(playerHandObj.hand)
      let fullHandCodes = this.sortIntoCodes(fullHandObj)
      let solved = this.solveHand(fullHandCodes)
      let score = solved[0]
      let hand = solved.slice(1)
      return {playerName: playerHandObj.playerName, score: score, hand: hand  }
    }else{
      let board = this.state.board
      let fullHandObj = board.concat(playerHandObj.hand)
      let fullHandCodes = this.sortIntoCodes(fullHandObj)
      let solved = this.solveHand(fullHandCodes)
      let hand = solved.slice(1)
      return {playerName: playerHandObj.playerName, score: -1, hand: hand  }
    }
  })
  let winnerAndLosers = arrayOfScoreObj.sort( (a, b) => {
    return b["score"] - a["score"]
  })
  this.setState({
    winner: winnerAndLosers[0].playerName,
    winningHand: winnerAndLosers[0].hand,
    phase: "round-end",
    currentBet: 0,
    bettorPosition: 0
  }, () => this.updateTable())
  this.winnerWinnerChickenDinner(winnerAndLosers[0].playerName)
  setTimeout( () => {
    this.redeal()
    this.dealToPlayers()
  }, 6000)

}


bet(value, playerName, raise){
  console.log("in bet", raise)
  const updatePot = parseInt(this.state.pot, 10) + parseInt(value, 10)
  this.setState( {
    pot: updatePot,
    bettorPosition: this.state.currentPlayerPos,
    currentPlayerPos: this.playerPositioning(),
    currentBet: parseInt(value, 10),
    message: raise ? `${playerName} raises to ${value}!` : `${playerName} bets ${value}!`
  }, () => this.updateTable() )
}

call(playerName){
  console.log("bettor", this.state.bettorPosition)
  console.log("current", this.state.currentPlayerPos)
  let array = this.playerPArray()
  let finalPosition = array[array.length - 1]
  if (this.playerPositioning() !== this.state.bettorPosition){
    this.setState({ pot: this.state.pot + this.state.currentBet, currentPlayerPos: this.playerPositioning(), message: `${playerName} calls` }, () => this.updateTable())
  }else{
    this.setState({ pot: this.state.pot + this.state.currentBet, message: `${playerName} calls` }, () => this.nextCard() )

  }
}

fold(playerName){
  let array = this.playerPArray()
  let finalPosition = array[array.length - 1]
  let moreFoldedPlayers = this.state.foldedPlayers.concat(playerName)

  if (this.state.foldedPlayers.length  === this.state.players.length - 2){
    this.setState({
      foldedPlayers: moreFoldedPlayers, message: `${playerName} folds`
    }, () => {
      this.sortAndDeclareWinner()
    })
  }else if (this.state.foldedPlayers.length === this.state.players.length - 1){
    this.setState({
      foldedPlayers: moreFoldedPlayers, message: "Nobody wins!"
    }, () => {
      this.sortAndDeclareWinner()
    })

  }else if (finalPosition === this.state.currentPlayerPos && this.state.currentBet > 0){
    this.setState({
      foldedPlayers: moreFoldedPlayers, currentPlayerPos: this.playerPositioning(), message: `${playerName} folds`
    }, () => {
      this.updateTable()
    })
  }else if (finalPosition === this.state.currentPlayerPos){
    this.setState({
      foldedPlayers: moreFoldedPlayers, message: `${playerName} folds`
    }, () => {
      this.nextCard()
    })
  }
  else{
    this.setState({

      foldedPlayers: moreFoldedPlayers, currentPlayerPos: this.playerPositioning(), message: `${playerName} folds`

    }, () => this.updateTable())
  }


  console.log(this.state.foldedPlayers)
  console.log(playerName)
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
  const flushCards = this.findFlush(sortedHand)
  const straight = this.findStraight(straightSort)
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
  let handPoints = parseInt(points, 10)
  let handPlayerObj = { player: this.props.player, points: handPoints }
  this.props.reveal(handPlayerObj)
}

redeal(){
  let playerNames = this.state.players.map( player => player.username)
  this.setState({
    board: [],
    playerHand: [],
    activePlayers: playerNames,
    currentPlayerPos: this.newCardPlayerPosition(),
    phase: "pre-flop",
    dealt: false,
    foldedPlayers: [],
    winner: '',
    winningHand: '',
    pot: 0,
    message: '',
    dealerButtonPosition: this.handleDealerButton()
  }, () => this.updateTable())

}

handleDealerButton(){
  // return (this.state.dealerButtonPosition + 1) % (this.state.players.length)
  return ( (this.state.dealerButtonPosition ) % this.state.players.length) + 1
}

newCardPlayerPosition(){
  return ( (this.state.dealerButtonPosition + 1 ) % this.state.players.length ) + 1
  // return ( ( this.state.dealerButtonPosition + 1 ) % this.state.players.length)
}
// dp 1  3=> 2
// dp 2 % 3=> 1
// dp 1 + 1 % 3=> 1

handlePlayerAction(playerName){
  // let array = this.playerPArray()
  let finalPosition = this.state.dealerButtonPosition
  console.log("final position", finalPosition)
  console.log("currentPlayerPos", this.state.currentPlayerPos)
  if (this.state.currentPlayerPos === finalPosition ){
    console.log("NEXT CARD!!!")
    this.nextCard()
  }else{
    console.log("NEXT POSITIONNN!!!")

    this.setState({
      currentPlayerPos: this.playerPositioning(), message: `${playerName} checks`
    }, () => this.updateTable() )

  }
}

render(){

  console.log("state", this.state)
  // console.log("DECK ID", this.state.deckID)
  if(this.state.dealt && this.state.deckID){
    let showCards
    if(this.state.board.length > 0){
      showCards = this.state.board.map( (el,index) => <img key={el.image} className="card animated slideInDown" src={el.image} alt="boohoo" width="80" height="105"/> )
    }
    let hands = []
    this.state.playerHand.forEach( (handInfo, idx) => {
      this.state.players.map( (player, index) => {
        if (handInfo.playerName === player.username){
          hands.push(
            <Player
              position={index + 1}
              key={player.id}
              player={player}
              handlePlayerAction={(playerName) => this.handlePlayerAction(playerName)}
              board={this.state.board}
              hand={handInfo.hand}
              nextCard={ () => this.nextCard() }
              fold={ (playerName) => this.fold(playerName) }
              bet={ (value, playerName, raise) => this.bet(value, playerName, raise) }
              reveal={ (playerHandObj) => this.findWinningHand(playerHandObj)}
              phase={this.state.phase}
              dealer={this.state.dealerButtonPosition}
              currentPlayerPos={this.state.currentPlayerPos}
              redeal={() => this.redeal()}
              foldedPlayers={this.state.foldedPlayers}
              folded={this.state.foldedPlayers.includes(player.username)}
              currentBet={this.state.currentBet}
              call={(playerName) => this.call(playerName) }
            />
          )
        }
      }
    )

  })
  return(
    <div className="full-board animated fadeIn">
      {this.state.tableName ? <p className="animated slideInDown board-text">{this.state.tableName}</p> : null}
      <div className="center-board ">
        {this.state.message ? <p className="animated pulse infinite board-text">{this.state.message}</p> : null}
        <p className="board-text animated fadeIn">{this.state.phase}</p>
        {this.state.phase === "round-end" ? <h3 className="board-text animated flash"> {this.state.winner} wins with {this.state.winningHand} </h3> : null}
        <h4 className="board-text pot animated fadeIn">Pot: {this.state.pot}</h4>
        {showCards ? showCards : null}
      </div>

      {hands}
      <MessageBox cableApp={this.props.cableApp} tableID={this.state.tableID}/>
    </div>
  )
}else {

  return(
    <div className="full-board animated fadeIn">
      {this.state.message ? <p className="animated pulse infinite board-text">{this.state.message}</p> : null}

      <div className="center-board ">
        {this.state.tableName ? <p className="animated zoomIn board-text">Welcome to {this.state.tableName}</p> : null}
        {sessionStorage.getItem("User") === "mega0319" ? <button className="animated pulse infinite btn-lg btn-success" onClick={() => this.dealToPlayers() }>Deal!</button> : <h3 className="board-text animated infinite pulse"> WAITING FOR DEAL</h3>}

      </div>
    </div>
  )
}
}
}
