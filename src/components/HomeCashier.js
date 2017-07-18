import React from 'react'

export default class HomeCashier extends React.Component{
  constructor(){
    super()

    this.state = {
      players: [],
      chips: 0,
      currentPlayer: '',
      chips: 0
    }
  }

  componentDidMount(){
    return fetch(`http://${window.location.hostname}:3000/users_scores`)
    .then( res => res.json() )
    .then( data => this.setState({ players: this.sortData(data)  }) )
    .then( () => this.findSelf() )
  }

  findSelf(){
    return fetch(`http://${window.location.hostname}:3000/users/${parseInt(sessionStorage.getItem("user_id"))}`)
    .then( res => res.json() )
    .then( data => this.setState ({ currentPlayer: data, chips: data.play_chips}))
  }

  sortData(data){
    return data.sort( (a, b) => b.play_chips - a.play_chips )
  }

  addChips(){
    return fetch(`http://${window.location.hostname}:3000/users/${parseInt(sessionStorage.getItem("user_id"))}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "PATCH",
      body: JSON.stringify({
        user:
        {
          play_chips: this.state.chips + 1000
        }
      })
    })
    .then(res => res.json() )
    .then(data => this.setState({ chips: data.play_chips }, () => alert("Just added 1000 chips!")))
  }


  render(){

    let userData = this.state.players.map( player => <tr className="t-data"> <td className="cell">{player.username}</td> <td>${player.play_chips}</td></tr>)

    return (

      <div>

        <img className="jeeves animated fadeIn" src={require('../images/Jeeves.svg')} onClick={ () => this.addChips() } alt="" width="700" height="900"/>
        <h4 className="chip-count-text">you have {this.state.chips}  chips</h4>


        <table className="table-bordered table-striped fulltable">
          <h4 className="table-title">Top Chip Counts</h4>
          <tbody>
            <tr>
              <th className="t-headers cell">Player</th>
              <th className="t-headers cell">Chips</th>
            </tr>
            {userData}
          </tbody>

        </table>
        <div className="chip-count">

        </div>
      </div>
    )
  }
}
