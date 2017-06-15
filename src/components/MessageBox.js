import React from 'react'

export default class MessageBox extends React.Component{


  render(){
    return(
      <div className="message-box">
        <form>
          <input type="text" />
          <input type="submit" />
        </form>
      </div>

    )
  }
}
