import React, { useState, useRef }  from 'react';
import './contribute.css';
import { RiArrowGoBackFill } from "@react-icons/all-files/ri/RiArrowGoBackFill";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { FaTimes } from "@react-icons/all-files/fa/FaTimes";
import $ from 'jquery'
//import { AiFillStar } from "@react-icons/all-files/ai/AiFillStar";
import useSound from 'use-sound';
import boopSfx from './click.mp3';
import ContentEditable from "react-contenteditable";

function Verify({items, isLoaded}){
    //const [index, setIndex] = useState(0);
  if (isLoaded){
    return(
        <div id="verify">

            {items.map((question, index) =>(
                <div id="question" className={index} key={"yes" + index}>
                  <div className="title">
                    {question.title}
                  </div>
                  { question.options.split(',').map((option, index)=>(
                    <div className="option" key={"option: " + index}>
                      <div className="list" key={"list"+ index}>
                        {
                          // eslint-disable-next-line
                          (option == question.options.split(',')[question.answer] && <FaCheck/>) || <FaTimes/>
                        }
                      </div>
                      <div className="content" key={"content"+ index}>{option}</div>
                    </div>
                  ))}
                  <div className="choice" key={"choice"+ index}>
                    <div className="a" onClick={() => $("." + index).css("display", 'none') }>
                      <FaCheck/>
                    </div>
                    <div className="b">
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
      </div>
  )



}


function Add(){
  const editableRef = useRef();
  const [play] = useSound(boopSfx, {
    volume: .05,
    playbackRate: 1,
    interrupt: true,
  });
  const [count, setCount] = useState("title")
  const [possible, setPossible] = useState("title")
  let regex = new RegExp("^\\s+[A-Za-z,;'\"\\s]+[?]$")

  return(
    <div id="verify">
      <div id="holder">
        <ContentEditable
            innerRef={editableRef}
            tagName="div"
            id="qtitle"
            html={count}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text");
              document.execCommand("insertText", false, text);
            }}
            onChange={(e) => {
              const html = e.target.value;
              $.ajax({
                  url: "https://triviabeat.dev/cq", //must be https or else it will do GET only!
                  type: "PUT",
                  timeout: 10000,
                  headers: {
                    title: html
                  }
                })
                  .done(function (res) {
                    if (res) {
                      //setItems(res);
                      console.log(res)
                      //setIsLoaded(true);

                    }
                  })
                  .fail(function (res) {
                    console.log(res);
                  })
              setCount(html);
            }}
          />
        <p id="count">{count.length} /150</p>
      </div>

    </div>
  )

}

export default function Contribute({setDisplay, items, isLoaded}){
  const [mode, setMode] = useState(0);
  const amount = 5;
  return(
    <div>
      <div id="header">
        <button onClick={() => setMode(1)}>Add</button>
        <button onClick={() => setMode(0)}>Verify</button>
        <button id="back" onClick={() => setDisplay(0)}><RiArrowGoBackFill /></button>
      </div>
      {mode === 0 && <Verify items={items} isLoaded={isLoaded}/>}
      {mode === 1 && <Add/>}

    </div>
  );


}
