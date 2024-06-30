import React from 'react';
import { useState } from 'react';
import { Input } from '../components/Input';
import { MyGlobe } from '../components/MyGlobe';
import { VictoryBox } from '../components/VictoryBox';
import { InfoBox } from '../components/InfoBox';
import { Menu } from '../components/Menu';

const Game = () => {
  const [guess, setGuess] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [closest, setClosest] = useState({ country: 0, distance: 1000000 });
  const [victory, setVictory] = useState(false);

  const data = {
    guess,
    setGuess,
    guesses,
    setGuesses,
    closest,
    setClosest,
    victory,
    setVictory,
  };

  return (
    <div className='flex justify-center overflow-hidden select-none'>
      <div className='absolute top-0 w-2/3 sm:w-5/6 sm:max-w-xl z-50'>
        {victory ? <VictoryBox data={data} /> : <InfoBox data={data} />}
      </div>
      <div className='w-fill bg-stone-950 absolute'>
        <MyGlobe data={data} />
      </div>
      <div className='bottom-5 fixed w-2/3 sm:w-5/6 sm:max-w-xl'>
        {!victory && <Input data={data} />}
      </div>
    </div>
  );
};

export default Game;
