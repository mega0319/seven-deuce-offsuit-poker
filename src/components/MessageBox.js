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

  componentDidMount(){
    return fetch(`http://${window.location.hostname}:3000/messages?pokertable_id=${this.props.tableID}`)
    .then( res => res.json() )
    .then( data => {
      const messages = data || []
      this.setState({ messages: messages}, () => {
        this.props.cableApp.messageschannel = this.props.cableApp.cable.subscriptions.create('MessagesChannel',
        {
          received: (cableData) => {
            this.setState( { messages: [...this.state.messages, cableData] }) }
          })
        })
      })
    }

    componentDidUpdate(){
      let chat = document.querySelector('.message-box')
      chat.scrollTop = chat.scrollHeight
    }

    handleMessageCreate(){
      this.props.cableApp.messageschannel.send(
        {message:
          {
            user_id: sessionStorage.getItem("user_id"),
            poker_table_id: this.props.tableID,
            content: this.state.input
          }
        }
      )
    }

    handleInputChange(e){
      this.setState({ input: e.target.value })
    }

    handleSubmit(e){
      e.preventDefault()
      this.handleMessageCreate()
      this.setState({ input: ''})
    }

    render(){
      let allMessages;

      if (this.state.messages.length){
        allMessages = this.state.messages.map( message => <MessageItem key={message.id} player={message.user.username} content={message.content} /> )
      }else{
        allMessages = <p>Chat with other players!</p>
      }
      return(
        <div className="message-container">
          <div className="animated fadeIn message-box">

            <ul className="message-ul">
              {allMessages}
            </ul>
          </div>
          <div>

          </div>
          <form className="message animated fadeIn" onSubmit={(e) => this.handleSubmit(e)}>
            <input className="message-input animatedfadeIn" onChange={(e) => this.handleInputChange(e)} type="text" value={this.state.input} placeholder="Type message here" />
          </form>
        </div>

      )
    }
  }
