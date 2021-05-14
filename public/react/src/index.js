import React, { useState, useEffect } from 'react';
import $ from 'jquery'
import ReactDOM from 'react-dom';
import Menu from './Menu'
import Play from './Play'
import Contribute from './Contribute'
import Leaderboard from './Leaderboard'
import Store from './Store'
import Account from './Account'
import './index.css';
import useSound from 'use-sound';
import boopSfx from './click.mp3';

function App(){
  // Declare a new state variable, which we'll call "count"
  const [display, setDisplay] = useState(0);
  const [play] = useSound(boopSfx, {
    volume: .05,
    playbackRate: 4,
    interrupt: true,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState(["Cake"]);
  const amount = 5;
  useEffect(()=>{
    $.ajax({
          url: "https://triviabeat.dev/uq", //must be https or else it will do GET only!
          type: "PUT",
          timeout: 10000,
          headers: {
            userid: 1,
            amount: amount
          }
        })
          .done(function (res) {
            if (res) {
              setItems(res);
              console.log(res)
              setIsLoaded(true);

            }
          })
          .fail(function (res) {
            console.log(res);
          });
    }, [])

  return(

    <div onClick={()=> {
      console.log();
      play();
    }}>
        {display === 0 && <Menu setDisplay={setDisplay}/>}
        {display === 1 && <Play setDisplay={setDisplay}/>}
        {display === 2 && <Contribute setDisplay={setDisplay} isLoaded={isLoaded} items={items}/>}
        {display === 3 && <Leaderboard setDisplay={setDisplay}/>}
        {display === 4 && <Store setDisplay={setDisplay}/>}
        {display === 5 && <Account setDisplay={setDisplay}/>}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
