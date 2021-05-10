import React from 'react';



export default function Leaderbaord({setDisplay}){

  return(
    <div>
      <h1>Leaderboard</h1>
      <button onClick={() => setDisplay(0)}>Go back</button>
    </div>
  );


}
