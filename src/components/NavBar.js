import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar(){

  return (
    <nav className={`navbar navbar-black`}>
      <div className='container-fluid'>
        <div className='navbar-header'>
          <a className='navbar-brand'>
            seven-two-offsuit
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/home/newgame">New Table</Link></li>
            <li><Link to="/games">Find Table</Link></li>
            <li><Link to="/home/friends">Friends</Link></li>
            <li><Link to="/home/messages">Messages</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
