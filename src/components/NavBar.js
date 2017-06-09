import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar(){

  return (
    <nav className={`navbar navbar-black`}>
      <div className='container-fluid'>
        <div className='navbar-header'>
          <a className='navbar-brand'>
            Pairmotely
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/projects">My Projects</Link></li>
            <li><Link to="/home/friends">Friends</Link></li>
            <li><Link to="/home/messages">Messages</Link></li>
            <li><Link to="/home/newproject">New Project</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
