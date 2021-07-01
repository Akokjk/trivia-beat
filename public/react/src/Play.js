import React, {useState} from 'react';
import './play.css';
import useSound from 'use-sound';
import boopSfx from './click.mp3';

export default function Play({setDisplay}){
  const [count, setCount] = useState(10);
  const [time, setTime] = useState(Date.now())
  const [play] = useSound(boopSfx, {
    volume: .1,
    playbackRate: 2,
    interrupt: true,
  });
  React.useEffect(() => {
    const timer =
    count > 0 && setInterval(() => setCount(count - 1), 1000);
    play();
    return () => clearInterval(timer);
  }, [count]);
  return(
    <div>

      <h1>Playing Trivia Beat</h1>
      <h2 >{count}</h2>
      <button onClick={() => setDisplay(0)}>Go back</button>
    </div>
  );


}
