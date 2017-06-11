import React from 'react'
import Bet from './Bet'
import styles from '../css/Board.css'

export default class PlayerHand extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      hand: props.hand,
      folded: false
    }
  }

  onFold(){
    this.setState({ folded: true})
    this.props.fold()
  }


  // solveHand(fullHand){
  //   //example of fullHand ["2D", "QH", "6C", "9D", "6S"]
  //   fullHand.forEach( card => {
  //     if(card[0])
  //   })
  // }

  render(){
    console.log(this.props)
  if(this.state.hand && !this.state.folded){

    const fullHand = this.props.board.concat(this.props.hand)

    const codes = fullHand.map( card => card.code )

    console.log(codes)

    let currentHand = this.state.hand.map( (el, idx) => <img key={idx} className="card" src={el.image} alt="boohoo" width="100" height="120"/> )

    console.log(this.props.player)

    return(
      <div >

          {currentHand}

        <Bet player={this.props.player} bet={this.props.bet} updatePlayChips={this.props.updatePlayChips}/>
        <button className="btn btn-default" onClick={() => this.props.nextCard() }> Check </button>
        <button className="btn btn-default" onClick={() => this.onFold() }> Fold </button>
      </div>
    )
  }else{
    console.log(this.props.board.map( card => card.code) )
    return(
      <div>
        <p>You are currently sitting out</p>
      </div>
    )
  }
}
}
