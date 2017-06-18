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
    return fetch(`http://localhost:3000/messages?pokertable_id=${this.props.tableID}`)
    .then( res => res.json() )
    .then( data => {
      const messages = data || []
      this.setState({ messages: messages}, () => {
        this.props.cableApp.messageschannel = this.props.cableApp.cable.subscriptions.create('MessagesChannel',
        {

          received: (cableData) => {
            // console.log("CNSOLE LOG:", cableData)
            this.setState( { messages: [...this.state.messages, cableData] }) }
        })
      })
    })
    // this.props.getUsers()

  }

  componentDidUpdate(){
    let chat = document.querySelector('.message-box')
    chat.scrollTop = chat.scrollHeight
  }

  handleMessageCreate(){
    // console.log("PROPS IN MSGS", this.props)
    this.props.cableApp.messageschannel.send(
      {message:
        {
          user_id: sessionStorage.getItem("user_id"),
          poker_table_id: this.props.tableID,
          content: this.state.input
        }
      }
    )
    // return fetch('http://localhost:3000/messages',{
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   method: "POST",
    //   body: JSON.stringify(
    //     {message:
    //       {
    //         user_id: sessionStorage.getItem("user_id"),
    //         poker_table_id: this.props.tableID,
    //         content: this.state.input
    //       }
    //     }
    //   )
    // })
    // .then(res => res.json() )
    // // .then(console.log)
    // .then( data => this.setState( { messages: data, input: ''} ))

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
    // console.log('STATE:', this.state)
    let allMessages;

    if (this.state.messages.length){
      allMessages = this.state.messages.map( message => <MessageItem key={message.id} player={message.user.username} content={message.content} /> )
    }else{
      allMessages = <p>Type Message Now</p>
    }
    // console.log(allMessages)
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
