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
      sessionStorage.setItem('Authorization', data.token)
      sessionStorage.setItem('User', data.user)
    }  )
    .then(() => this.props.history.push('/home'))
  }



  render(){

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5">
          </div>

          <div className="col-md-5">

            <h1> Pairmotely! </h1>

          </div>
        </div>
        <div className="row"></div>
        <div className="row">
          <div className="col-md-5">
          </div>

          <div className="col-md-5">

            <h3> Please Log In </h3>
          </div>
        </div>


        <form onSubmit={(e) => this.handleLogIn(e) }>
          <div className="row">
            <div className="col-md-5">
            </div>

            <div className="col-md-5">

              <input type="text" value={this.state.username} placeholder="username"
                onChange={ (e) => this.handleChange(e, "username")} />

              </div>
            </div>

            <div className="row">
              <div className="col-md-5">
              </div>

              <div className="col-md-5">

                <input type="password" value={this.state.password} placeholder="password"
                  onChange={ (e) => this.handleChange(e, "password")} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-5">
                </div>

                <div className="col-md-5">
                  <input type="submit" value="Log In"/>
                  <div>
                    <Link to="/create" >Create New Account
                  </Link>
                </div>

              </div>
            </div>
            {/* <button onClick={ () => this.createUserMode() }> Create New Account </button> */}

          </form>
        </div>
      )
    }

  }
  export default withRouter(LoginForm)
