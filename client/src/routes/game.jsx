import React from 'react';
import { useState } from 'react';
import { Input } from '../components/Input';
import { Presenter } from '../components/Presenter';
import { MyGlobe } from '../components/MyGlobe';

export const apiURI = 'https://api.metern.no';

const Game = () => {
  const [guess, setGuess] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [gameState, setGameState] = useState(true);

  const data = {
    guess,
    setGuess,
    guesses,
    setGuesses,
    gameState,
    setGameState,
  };

  return (
    <div className='flex justify-center overflow-hidden select-none'>
      <div className='w-fill bg-stone-950 absolute'>
        <MyGlobe data={data} />
      </div>
      <div className='bottom-0 absolute w-5/6 sm:w-96'>
        {gameState && (
          <div className='mb-2'>
            <Input data={data} />
          </div>
        )}
        {guesses.length > 0 && (
          <div className='bg-white text-gray-900 text-center py-5 rounded-t-sm'>
            <Presenter data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
