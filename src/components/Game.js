import React from 'react'
import BoardContainer from '../containers/BoardContainer'

export default function Game(props){

  return(
    <div className="find-games game-container">

      <BoardContainer cableApp={props.cableApp}/>

    </div>
  )
}
