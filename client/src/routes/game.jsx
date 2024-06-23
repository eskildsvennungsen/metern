import React from 'react';
import { useState, useEffect } from 'react';
import { Input } from '../components/Input';
import { Presenter } from '../components/Presenter';
import { MyGlobe } from '../components/MyGlobe';

export const apiURI = 'https://api.metern.no';

const Game = () => {
  const [country, setCountry] = useState(0);
  const [guess, setGuess] = useState(0);
  const [guesses, setGuesses] = useState([]);

  const data = {
    country,
    setCountry,
    guess,
    setGuess,
    guesses,
    setGuesses,
  };

  useEffect(() => {
    const fetchTodaysCountry = async () => {
      const res = await fetch(`${apiURI}/country/today`).then((res) => res.json());
      setCountry(res.data);
    };

    fetchTodaysCountry();
  }, []);

  return (
    <div className='overflow-hidden'>
      <div className='bg-slate-700 text-white text-center p-5 m-5 rounded-md shadow-2xl z-50 absolute top-5 sd:w-full'>
        <Presenter data={data} />
      </div>
      <div className='w-3/4 bg-slate-300'>
        <MyGlobe data={data} />
      </div>
      <div className='m-5 z-50 absolute bottom-0 sd:w-full'>
        <Input data={data} />
      </div>
    </div>
  );
};

export default Game;
