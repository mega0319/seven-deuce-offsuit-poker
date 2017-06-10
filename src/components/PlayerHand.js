import React from 'react'


export default function PlayerHand(props){

  if(props.hand.length > 0){

    console.log(props)
    let currentHand = props.hand.map( (el, idx) => <img key={idx} className="card" src={el.image} alt="boohoo" width="100" height="120"/> )

    return(
      <div>
        <div>
          {currentHand}
        </div>
        <button> Bet </button>
        <button onClick={() => props.nextCard() }> Check </button>
        <button onClick={() => props.fold() }> Fold </button>
      </div>
    )
  }else{
    return(
      <div>
        <button> Bet </button>
        <button onClick={() => props.nextCard() }> Check </button>
        <button> Fold </button>
      </div>
    )
  }
}
