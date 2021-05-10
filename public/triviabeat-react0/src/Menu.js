import React from 'react';
import './menu.css';
import WebFont from 'webfontloader';
import { AiFillHeart } from "@react-icons/all-files/ai/AiFillHeart";
import { BsFillDiamondFill } from "@react-icons/all-files/bs/BsFillDiamondFill";
import { IoLogoUsd } from "@react-icons/all-files/io/IoLogoUsd";
WebFont.load({
  google: {
    families: ['New Tegomin', 'Chilanka', 'Press Start 2P']
  }
});

export default function Menu({setDisplay}){


  return(
    <div id="menu">
      <div id="currency">
        <p>{0} <AiFillHeart/></p>
        <p>{0} <BsFillDiamondFill/></p>
        <p><IoLogoUsd/>{0}</p>
      </div>
      <h1>Trivia Beat</h1>
      <button onClick={() => setDisplay(1)}>Play</button>
      <button onClick={() => setDisplay(2)}>Contribute</button>
      <button onClick={() => setDisplay(3)}>Leaderboard</button>
      <button onClick={() => setDisplay(4)}>Store</button>
      <button onClick={() => setDisplay(5)}>Account</button>
    </div>
  );


}
