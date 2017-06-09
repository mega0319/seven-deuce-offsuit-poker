import React from 'react'


export default function Friends(props){

  console.log(props.users)
  let userNames = props.users.map( el => <li> {el.username} <button> Add Friend</button> </li> )

  return(
    <div>
      <h2>Users</h2>
      <div>
        <ul>
          {userNames}
        </ul>
      </div>

    </div>
  )
}
