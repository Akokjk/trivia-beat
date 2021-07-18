import React, { useState, useEffect } from 'react';
import $ from 'jquery'
import './menu.css';
import Cookies from 'js-cookie';
import WebFont from 'webfontloader';
import { AiFillHeart } from "@react-icons/all-files/ai/AiFillHeart";
import { BsFillDiamondFill } from "@react-icons/all-files/bs/BsFillDiamondFill";
import { IoLogoUsd } from "@react-icons/all-files/io/IoLogoUsd";
import logo from './loading.gif';

WebFont.load({
  google: {
    families: ['New Tegomin', 'Chilanka', 'Press Start 2P']
  }
});

export default function Menu({setDisplay}){
 const [currency, setCurrency] = useState([-1,-1,-1])
 const [login, setLogin] = useState("x")
 useEffect(()=>{
   setLogin(Cookies.get('login'));
   $.ajax({
         url: "https://triviabeat.dev/info", //must be https or else it will do GET only!
         type: "PUT",
         timeout: 10000,
         headers: {
           login: Cookies.get('login'),
         }
       })
         .done(function (res) {
           if (res) {
             setCurrency([res[0].hearts, res[0].gems, res[0].wei]);
             console.log(res)
           }
         })
         .fail(function (res) {
           console.log(res);
         });
   }, [])
  return(
    <div id="menu">
      <img src={logo} alt="loading..." id="currency" style={{ display: currency[0] > -1 ? "none" : "flex"}}/>
      <div id="currency" style={{ display: currency[0] > -1 ? "flex" : "none"}}>
        <p>{currency[0]}<AiFillHeart/></p>
        <p>{currency[1]} <BsFillDiamondFill/></p>
        <p><IoLogoUsd/>{currency[2]}</p>
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
