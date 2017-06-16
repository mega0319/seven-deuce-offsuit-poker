import React from 'react'
import MessageItem from './MessageItem'

export default class MessageBox extends React.Component{
  constructor(props){
    super(props)

    this.state ={
      input: '',
      messages: [],
      players:[]

    }
  }

  // componentWillReceiveProps(newProps){
  //     this.setState({ tableID: newProps.tableID})
  // }

  componentDidMount(){
    return fetch('http://localhost:3000/messages')
    .then( res => res.json() )
    .then( data => this.setState({ messages: data}))
    // this.props.getUsers()
  }

  componentDidUpdate(){
    let chat = document.querySelector('.message-box')
    chat.scrollTop = chat.scrollHeight
  }

  handleMessageCreate(){
    return fetch('http://localhost:3000/messages',{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(
        {message:
          {
            user_id: sessionStorage.getItem("user_id"),
            poker_table_id: this.props.tableID,
            content: this.state.input
          }
        }
      )
    })
    .then(res => res.json() )
    // .then(console.log)
    .then( data => this.setState( { messages: data, input: ''} ))

  }


  handleInputChange(e){
    this.setState({ input: e.target.value })
  }

  handleSubmit(e){
    e.preventDefault()
    this.handleMessageCreate()
  }

  render(){
    console.log('MessgaeBox render, props:', this.props)
    let allMessages = this.state.messages.map( message => <MessageItem key={message.id} player={message.user.username} content={message.content} /> )

    console.log(allMessages)
    return(
      <div>
        <div className="animated fadeIn message-box">

          <ul className="message-ul">
            {allMessages}
          </ul>
        </div>
        <form className="message form-group animated fadeIn" onSubmit={(e) => this.handleSubmit(e)}>
          <input className="message-input animatedfadeIn" onChange={(e) => this.handleInputChange(e)} type="text" value={this.state.input} />
          <input className="btn-sm btn-default" type="submit" value="Send" />
        </form>
      </div>

    )
  }
}
