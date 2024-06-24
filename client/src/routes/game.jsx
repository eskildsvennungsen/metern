import React from 'react';
import { useState } from 'react';
import { Input } from '../components/Input';
import { Presenter } from '../components/Presenter';
import { MyGlobe } from '../components/MyGlobe';

export const apiURI = 'https://api.metern.no';

const Game = () => {
  const [guess, setGuess] = useState(0);
  const [guesses, setGuesses] = useState([]);

  const data = {
    guess,
    setGuess,
    guesses,
    setGuesses,
  };

  return (
    <div className='overflow-hidden select-none'>
      <div className='bg-slate-700 text-white text-center p-5 m-5 rounded-md z-50 absolute left-0 right-0 md:left-1/3 md:right-1/3'>
        <Presenter data={data} />
      </div>
      <div className='w-3/4 bg-slate-300'>
        <MyGlobe data={data} />
      </div>
      <div className='m-5 z-50 absolute bottom-0 left-0 right-0 md:left-1/3 md:right-1/3'>
        <Input data={data} />
      </div>
    </div>
  );
};

export default Game;
