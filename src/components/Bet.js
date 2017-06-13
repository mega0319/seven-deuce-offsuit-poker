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
      <form className="board-inputs form-group" onSubmit={(e) => this.handleBetSubmit(e) }>

        <input  onChange={(e) => this.handleBetChange(e)} type="number" value={this.state.betAmount}/>

        <input className="btn btn-default" type="submit" value="Bet"/>

      </form>
    )
  }
}
