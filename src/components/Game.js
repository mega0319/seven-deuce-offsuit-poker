import React from 'react'
import BoardContainer from '../containers/BoardContainer'

export default class Game extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      cards: props.cards,
      players: []
    }
  }

  componentWillReceiveProps(){
    this.setState({
      cards: this.props.cards
    })
  }

  // getRandomInt() {
  //   return Math.floor(Math.random() * (52 - 1 + 1)) + 1
  // }

  componentWillUpdate(){

  }

  fisherYatesShuffle(cards){
    let m = cards.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = cards[m];
      cards[m] = cards[i];
      cards[i] = t;
    }
    return cards;
  }




  render(){
    if(this.state.cards.length > 0){

      let cards = this.state.cards

      let shuffledCards = this.fisherYatesShuffle(cards)

      return(
        <div>

          <h4>BOARD</h4>
          <BoardContainer cards={shuffledCards} players={this.state.players} />

        </div>
      )
    }else{
      return null
    }
  }

}
