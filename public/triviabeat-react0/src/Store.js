import React from 'react';



export default function Store({setDisplay}){

  return(
    <div>
      <h1>Store</h1>
      <button onClick={() => setDisplay(0)}>Go back</button>
    </div>
  );


}
