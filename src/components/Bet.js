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
    this.props.bet(this.state.betAmount)
    if(this.state.betAmount > 0)
    this.props.updatePlayChips(this.state.betAmount)
  }

  render(){
    return(
      <form className="board-inputs form-group animated fadeIn" onSubmit={(e) => this.handleBetSubmit(e) }>

        <input  onChange={(e) => this.handleBetChange(e)} min="0" max={this.props.chips} type="number" step="100" value={this.state.betAmount}/>

        <input className="btn btn-default" type="submit" value="Bet"/>

      </form>
    )
  }
}
