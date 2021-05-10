import React, { useState, useEffect }  from 'react';
import './contribute.css';
import { RiArrowGoBackFill } from "@react-icons/all-files/ri/RiArrowGoBackFill";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { FaTimes } from "@react-icons/all-files/fa/FaTimes";
import $ from 'jquery'
//import { AiFillStar } from "@react-icons/all-files/ai/AiFillStar";

function Verify({items, isLoaded}){
    //const [index, setIndex] = useState(0);
    if(isLoaded){
      if(items.length > 0){

        return(
          <div id="verify">
            {items.map((question, index) =>(

              <div id="question" class={index}>
                <div class="title">
                  {question.title}
                </div>
                {
                  question.options.split(',').map((option)=>(
                  <div class="option">
                    <div class="list">

                      {
                        // eslint-disable-next-line
                        (option == question.options.split(',')[question.answer] && <FaCheck/>) || <FaTimes/>
                      }
                    </div>
                    <div class="content">{option}</div>
                  </div>
                ))}
                <div class="choice">
                  <div class="a" onClick={() => $("." + index).css("display", 'none') }>
                    <FaCheck/>
                  </div>
                  <div class="b">
                    <FaTimes/>
                  </div>
                </div>
              </div>

            ))}
            </div>
        )
      }
      else return(
        <div id="verify">
          <h2>No questions to verify.</h2>
          </div>
      )
    }

}


export default function Contribute({setDisplay}){
  const [mode, setMode] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
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
              console.log(res)
              setIsLoaded(true);
              setItems(res);
            }
          })
          .fail(function (res) {
            console.log(res);
          });
  }, [])



  console.log("tEst")
  return(
    <div>
      <div id="header">
        <button onClick={() => setMode(1)}>Add</button>
        <button onClick={() => setMode(0)}>Verify</button>
        <button id="back" onClick={() => setDisplay(0)}><RiArrowGoBackFill /></button>
      </div>
      {mode === 0 && Verify({items, isLoaded})}
      {mode === 1 && <h1>Adding questions</h1>}

    </div>
  );


}
