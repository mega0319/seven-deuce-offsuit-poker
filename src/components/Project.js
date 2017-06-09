import React from 'react'
import CodeApp from './CodeApp'

export default class Project extends React.Component{
  constructor(){
    super()

    this.state = {
      allMessages: []
    }
  }

  render(){
    return(
      <div>
        <h3>Code Session</h3>
        <CodeApp />
      </div>
    )
  }

}
