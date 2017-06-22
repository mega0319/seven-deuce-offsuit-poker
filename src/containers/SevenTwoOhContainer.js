import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Game from '../components/Game'
import AllGames from '../components/AllGames'
import HomeCashier from '../components/HomeCashier'
import { withRouter } from 'react-router'

import BoardContainer from '../containers/BoardContainer'

class SevenTwoOhContainer extends React.Component{
  constructor(){
    super()

    this.state = {
      users: []
    }
  }

  componentWillMount(){
    if(!sessionStorage.getItem('Authorization')){
      return this.props.history.push('/login')
    }
  }


  logOut(){
    sessionStorage.clear()
    this.props.history.push('/login')
  }

  render(){
    return(
      <div className="homepage">
        <NavBar logOut={() => this.logOut() }/>
        <Switch>
          <Route exact path="/home/cashier" component={HomeCashier} />
          <Route exact path="/home/newgame" render={ () => <Game cableApp={this.props.cableApp}/> } />
          <Route exact path="/home/pokertables/:id" render={(props) => <BoardContainer cableApp={this.props.cableApp} started="started" {...props} />} />
          <Route exact path="/home/games" component={AllGames} />
        </Switch>
      </div>
    )
  }

}

export default withRouter(SevenTwoOhContainer)
