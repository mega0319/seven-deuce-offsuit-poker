import React from 'react'
import { createUser } from '../apis/Api'
import { Link} from 'react-router-dom'
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

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
    confirmAlert({
      title: 'Confirm to submit',                        // Title dialog
      message: 'You are about to create an account. Confirm and proceed to log in.',               // Message dialog
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',                             // Text button cancel
      onConfirm: () => createUser(this.state.username, this.state.password, this.state.email)
      .then( () => this.props.history.push('/home')
    ),
      onCancel: () => this.props.history.push('/home')
    })


  }

  render(){
    return (
      <div className="full-form container-fluid">
        <img src={require('../seven-deuce.jpg')} alt="" width="250" height="200"/>

        <h3> Create A New Account </h3>
        <form onSubmit={ (e) => this.handleSubmit(e)}>
          <div className="form-group">
            <input className="form-control form-custom" type="text" value={this.state.username} placeholder="username"
              onChange={ (e) => this.handleChange(e, "username")} />
          </div>
          <div className="form-group">
            <input className="form-control form-custom" type="password" value={this.state.password} placeholder="password"
              onChange={ (e) => this.handleChange(e, "password")} />
            </div>
              <div className="form-group">
            <input className="form-control form-custom" type="text" value={this.state.email} placeholder="e-mail"
              onChange={ (e) => this.handleChange(e, "email")} />
            </div>
              <div className="form-group">

                <input className="btn-lg btn-default" type="submit" value="Create Account" />
              </div>

            </form>
            <Link to="/login">Already have an account? Click here </Link>
          </div>
        )
      }
    }
