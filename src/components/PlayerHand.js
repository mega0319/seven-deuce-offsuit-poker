import React from 'react'
import Bet from './Bet'
import styles from '../css/Board.css'

export default class PlayerHand extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      hand: props.hand,
      folded: false,
      phase: props.phase
    }
  }

  componentWillReceiveProps(props){
    this.setState({ phase: props.phase})
  }

  onFold(){
    this.setState({ folded: true })
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

  findStraight(fullHandArr) {
    if (fullHandArr[4] - fullHandArr[0] === 4){
      return `Straight ${fullHandArr[0]} to ${fullHandArr[4]}`
    }else if (fullHandArr[5] - fullHandArr[1] === 4){
      return `Straight ${fullHandArr[1]} to ${fullHandArr[5]}`
    }else if (fullHandArr[6] - fullHandArr[2] === 4){
      return `Straight ${fullHandArr[2]} to ${fullHandArr[6]}`
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
    let handPlayerObj = { player: this.props.player, points: handPoints }
    this.props.reveal(handPlayerObj)
  }

  render(){
    console.log(this.props)

    if(this.state.hand && !this.state.folded && this.state.hand ){

      const fullHand = this.props.board.concat(this.props.hand)

      const codes = fullHand.map( card => card.code )

      let currentHand = this.state.hand.map( (el, idx) => <img key={idx} className="card animated rollIn" src={el.image} alt="boohoo" width="100" height="120"/> )

      let preSolve = this.solveHand(codes)

      let handSolve = preSolve.slice(1)



      if(this.props.position === 1){

        return(
          <div className="animated rollIn">
            {currentHand}

            {handSolve ? <p className="board-text">{handSolve}</p> : null}

            <Bet player={this.props.player} bet={this.props.bet} updatePlayChips={this.props.updatePlayChips}/>

            <button className="btn btn-default" onClick={() => this.props.nextCard(handSolve) }> Check </button>

            <button className="btn btn-default" onClick={() => this.onFold() }> Fold </button>

          </div>
        )
      }else{
        return(
          <div className="">

            {currentHand}

            {handSolve ? <p className="board-text">{handSolve}</p> : null}

          </div>
        )
      }
    }else{
      console.log(this.props.board.map( card => card.code) )
      return(
        <div>

          <p className="board-text">You are currently sitting out</p>

        </div>
      )
    }
  }
}
