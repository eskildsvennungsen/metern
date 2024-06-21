import React from 'react';
import { useState, useEffect } from 'react';
import { Input } from './components/Input';
import { Presenter } from './components/Presenter';
import { MyGlobe } from './components/MyGlobe';

const apiURI = 'http://localhost:4000';

const App = () => {

  const [country, setCountry] = useState(0);
  const [guess, setGuess] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [guesses, setGuesses] = useState([]);

  const data = {
    country, 
    setCountry,
    guess,
    setGuess,
    gameWon,
    setGameWon,
    guesses,
    setGuesses
  }

  useEffect(() => {
    const fetchTodaysCountry = async () => {
      const res = await fetch(`${apiURI}/country/today`).then((res) => res.json());
      setCountry(res.data);
    }

    fetchTodaysCountry();
  }, []);

  return (
    <div className='overflow-hidden'>
      <div className='bg-slate-700 text-white text-center rounded-md max-w-80 min-w-64 shadow-2xl p-5 z-50 absolute top-4 inset-x-10'>
        <Presenter data={data} /> 
      </div>
      <div>
        <MyGlobe data={data} />
      </div>
      <div className='bg-slate-700 text-white text-center rounded-md max-w-80 min-w-64 shadow-2xl p-5 z-50 absolute bottom-4 inset-x-10'>
        <Input data={data} />
      </div>
    </div>
  );
}

export default App;
