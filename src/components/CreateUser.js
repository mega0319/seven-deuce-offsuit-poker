import React from 'react'
import { createUser } from '../apis/Api'
import { Link} from 'react-router-dom'

export default class CreateUser extends React.Component {

  constructor(){
    super()

    this.state = {
      username:'',
      password:'',
      email: ''
    }
  }

  handleChange(e, input){
    this.setState({
      [input]: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    createUser(this.state.username, this.state.password, this.state.email)
    .then( () => this.props.history.push('/home'))
  }

  render(){
    return (
      <div>
        <form onSubmit={ (e) => this.handleSubmit(e)}>

          <input type="text" value={this.state.username} placeholder="username"
            onChange={ (e) => this.handleChange(e, "username")} />

            <input type="password" value={this.state.password} placeholder="password"
              onChange={ (e) => this.handleChange(e, "password")} />

            <input type="text" value={this.state.email} placeholder="e-mail"
              onChange={ (e) => this.handleChange(e, "email")} />

            <input type="submit" />

            </form>
            <Link to="/login">Already have an account? Click here </Link>
          </div>
        )
      }
    }
