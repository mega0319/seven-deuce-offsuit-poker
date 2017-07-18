import React from 'react'


export default function MessageItem(props){

  return(
      <p className="message-text">{props.player}: {props.content}</p>
  )
}
