import React from 'react';

export default function Account({setDisplay}){

  return(
    <div>
      <h1>Account</h1>
      <button onClick={() => setDisplay(0)}>Go back</button>
    </div>
  );


}
