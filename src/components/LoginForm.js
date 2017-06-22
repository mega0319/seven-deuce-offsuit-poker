import React from 'react'
import { logIn } from '../apis/Api'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'


class LoginForm extends React.Component{
  constructor(){
    super()

    this.state = {
      username: '',
      password: ''
    }
  }

  componentDidMount(){
    if (sessionStorage.getItem("Authorization")){
      this.props.history.push('/home')
    }
  }

  handleChange(e, input){
    this.setState({
      [input]: e.target.value
    })
  }

  createUserMode(){
    this.setState({
      createMode: !this.state.createMode
    })
  }

  handleLogIn(e){
    e.preventDefault()
    console.log("IN HANDLE LOGIN")
    logIn(this.state.username, this.state.password)
    .then( data => {
      if(data.token){
        sessionStorage.setItem('Authorization', data.token)
        sessionStorage.setItem('User', data.user)
        sessionStorage.setItem('user_id', data.user_id)
        sessionStorage.setItem('Chips', data.play_chips)
      }else{
        sessionStorage.setItem('Error', data.error)
      }
    })
    .then(() => this.props.history.push('/home'))
  }

  render(){

    return (
      <div id="black-wrapper">
        <div className="first-divider">

        </div>
      <div className="full-form">
        <img src={require('../SDOS_Logo-01.svg')} alt="" width="250" height="200"/>
        {sessionStorage.getItem("Error") ? <p className="error">{sessionStorage.getItem("Error")}</p> : null}
        {sessionStorage.removeItem("Error")}
        <h3 className="board-text"> Please Log In </h3>
        <form onSubmit={(e) => this.handleLogIn(e) }>
          <div className="form-group" >
            <input className="form-control form-custom" type="text" value={this.state.username} placeholder="username"
              onChange={ (e) => this.handleChange(e, "username")} />
            </div>

            <div className="form-group" >
              <input className="form-control form-custom" type="password" value={this.state.password} placeholder="password"
                onChange={ (e) => this.handleChange(e, "password")} />

                <div className="form-group" >
                  <br /><input className="btn-lg btn-default" type="submit" value="Log In"/>
                </div>
              </div>
              <div className="form-group" >

                <Link to="/create" >Create New Account </Link>
              </div>
            </form>

          </div>
          <div className="login-icon-row">
            <a className="login-icons" href="http://wwww.github.com/mega0319" ><i className="fa fa-github fa-3x" aria-hidden="true"></i> </a>
            <a className="login-icons" href="https://www.linkedin.com/in/naz-khan-32921b41" ><i className="fa fa-linkedin-square fa-3x" aria-hidden="true"></i> </a>
            <a className="login-icons" href="http://wwww.naz-khan.com" ><i className="fa fa-user-circle fa-3x" aria-hidden="true"></i> </a>

            <h4 className="board-text center-text">created by Naz Khan</h4>
          </div>
        </div>
        )
      }

    }
    export default withRouter(LoginForm)
