import React from 'react';
import './play.css';


export default function Play({setDisplay}){


  return(
    <div>
      <h1>Playing Trivia Beat</h1>
      <button onClick={() => setDisplay(0)}>Go back</button>
    </div>
  );


}
