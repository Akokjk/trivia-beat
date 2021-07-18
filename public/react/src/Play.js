import React, {useState} from 'react';
import './play.css';
import useSound from 'use-sound';
import { RiArrowGoBackFill } from "@react-icons/all-files/ri/RiArrowGoBackFill";
import countSfx from './song.mp3';
import boopSfx from './click.mp3';
import { FaTimes } from "@react-icons/all-files/fa/FaTimes";
import { AiFillHeart } from "@react-icons/all-files/ai/AiFillHeart";
import $ from 'jquery';

export default function Play({setDisplay}){
  const [count, setCount] = useState(10);
  const [time, setTime] = useState(Date.now())
  const [play] = useSound(countSfx, {
    volume: .5,
    playbackRate: 1,
    interrupt: false,
  });
  const [tick] = useSound(countSfx, {
    volume: .5,
    playbackRate: 1,
    interrupt: true,
  });


/*
Game loop
player joins the lobby, play lobby music, maybe create a minigame to earn hearts or show an ad
generate questions that be used for the player put them in an array
show the number of players waiting to join
when the the correct number of players joins start down countdown
create a timer to gauge how long it takes the player to finish the questions
render the question and answers
get the player response show their placement in the match on the top left
ever 10th question is a refresh question and thus a freebie from question missed in previous games

*/



  React.useEffect(() => {

    const timer =
    count > 0 && setInterval(() => setCount(count - 1), 1000);
    //if(count === 0) setCount("When did you die?");
    const time = ((count-1)/10)*100;
    const date = new Date();
    $("#progressbar").css("width", time+"%")
    tick();
    return () => {
      clearInterval(timer)

    };
  }, [count]);

  React.useEffect(()=>{

  }, [])

  return(
    <div id="game">
      <div id="game_question">{count || "Question"}</div>
      <div id="score">Score: </div>
      <div id="countdown">
          <div id="progressbar"></div>
      </div>
      <div id="container">
        <button id="choice_a">Choice A</button>
        <button id="choice_b">Choice B</button>
      </div>
      <div id="container">
        <button id="choice_c">Choice C</button>
        <button id="choice_d">Choice D</button>
      </div>
      <div id="container">
        <button id="heart"><AiFillHeart /><p>3</p></button>
        <button id="skip" onClick={() => setDisplay(0)}><FaTimes /></button>
      </div>

    </div>
  );


}
