export function createUser(username, password, email){
  return fetch(`http://${window.location.hostname}:3000/users`, {
    headers: {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify( {user: {username: username, password: password, email: email}})
  })
  .then( res => res.json() )
}

export function logIn(username, password){
  return fetch(`http://${window.location.hostname}:3000/auth`, {
    headers: {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify( {username: username, password: password} )
  })
  .then( res => res.json() )
}
