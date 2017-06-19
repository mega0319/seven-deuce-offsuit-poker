import React, {Component} from 'react'

export default class Bet extends Component{
  constructor(){
    super()

    this.state = { betAmount: '' }
  }

  handleBetChange(e){
    this.setState({ betAmount: e.target.value })
  }

  handleBetSubmit(e){
    e.preventDefault()
    if(this.state.betAmount > 0)
    this.props.bet(this.state.betAmount, this.props.player)
    if(this.state.betAmount > 0)
    this.props.updatePlayChips(this.state.betAmount)
  }

  render(){
    return(
      <form className="board-inputs form-inline animated fadeIn" onSubmit={(e) => this.handleBetSubmit(e) }>

        <input  className="action-buttons" onChange={(e) => this.handleBetChange(e)} min="0" max={this.props.chips} type="number" step="100" value={this.state.betAmount}/>

        <input className="btn btn-warning" type="submit" value="Bet"/>

      </form>
    )
  }
}
