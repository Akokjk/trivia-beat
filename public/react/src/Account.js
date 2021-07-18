import React, { useState, useEffect } from 'react';
import $ from 'jquery'
import './account.css';
import { RiArrowGoBackFill } from "@react-icons/all-files/ri/RiArrowGoBackFill";
import Cookies from 'js-cookie';
import avat from './avatar.png';
import rank from './rank.png';
export default function Account({setDisplay}){
  const [user, setUser] = useState("User")
  const [login, setLogin] = useState("x")
  useEffect(()=>{
    setLogin(Cookies.get('login'));
    $.ajax({
          url: "https://triviabeat.dev/stats", //must be https or else it will do GET only!
          type: "PUT",
          timeout: 10000,
          headers: {
            login: Cookies.get('login'),
          }
        })
          .done(function (res) {
            if (res) {
              setUser([res[0].username, res[0].id, res[0].role]);
              console.log(res)
            }
          })
          .fail(function (res) {
            console.log(res);
          });
    }, [])
  return(
    <div>
      <div id="personal">
        <div id="avatar">
            <img src={avat} alt="avatar" id="avatar"/>
        </div>
        <div id="info">
          <div>
            <div id="infon">
              Username
            </div>
            <div id="infon1">
              ID #
            </div>

          </div>
          <div>Whats up bro?</div>
        </div>
      </div>
      <div id="stats">
        <div id="itext">
          <div id="stitle">Stats</div>
          <p>Questions Answered:</p>
          <p>Questions Contributed:</p>
          <p>Last login: </p>
        </div>
        <div id="role"><img src={rank} alt="rank" id="role"/></div>
      </div>

      <div id="settings">
        <div id="shalf">Settings</div>
        <div>Logout</div>
      </div>
      <button onClick={() => setDisplay(0)} id="backto"><RiArrowGoBackFill /></button>

    </div>
  );


}
