import React, {Component} from 'react'

export default class Bet extends Component{
  constructor(props){
    super(props)

    this.state = { betAmount: props.currentBet ? props.currentBet*2 : 0 }
  }

  handleBetChange(e){
    this.setState({ betAmount: e.target.value })
  }

  handleBetSubmit(e){
    e.preventDefault()
    if(this.state.betAmount > 0)
    this.props.bet(this.state.betAmount, this.props.player, this.props.raise)
    if(this.state.betAmount > 0)
    this.props.updatePlayChips(this.state.betAmount)
  }

  render(){
    console.log("raise in bet", this.props.raise)
    if(this.props.raise){
      return(
        <form className="board-inputs form-inline animated fadeIn" onSubmit={(e) => this.handleBetSubmit(e) }>
          <span class="input-group-addon">$</span>
          <input  className="form-control action-buttons" onChange={(e) => this.handleBetChange(e)} min={this.props.currentBet * 2} max={this.props.chips} type="number" step="100" value={this.state.betAmount}/>

          <input className="btn btn-warning" type="submit" value="RAISE"/>
        </form>
      )
    }else{
      return(
        <form className="board-inputs form-inline animated fadeIn" onSubmit={(e) => this.handleBetSubmit(e) }>
          {/* <span className="input-group-addon">$</span> */}
          <input  className="form-control action-buttons" onChange={(e) => this.handleBetChange(e)} min="0" max={this.props.chips} type="number" step="100" value={this.state.betAmount}/>

          <input className="btn btn-warning" type="submit" value="Bet"/>
        </form>
      )
    }
  }
}
