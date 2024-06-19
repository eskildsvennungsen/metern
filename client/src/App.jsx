import React, { useState, useEffect } from 'react';
import { dailyNumber } from './components/dailynumber';

const URI = 'http://localhost:4000';

async function fetchRandomCountry() {
  const res = await fetch(`${URI}/game/country`).then((res) => res.json());
  return res.data;
}

function App() {
  const number = dailyNumber(243);

  const [country, setCountry] = useState(0);
  const [day, setDay] = useState(number);

  useEffect(() => {
    setDay(number);
  });

  useEffect(() => {
    if (country !== 0) return;

    async function startFetching() {
      const json = await fetchRandomCountry();
      setCountry(json);
    }

    startFetching();
  }, []);

  return (
    <div className='bg-slate-700 text-white'>
      <div>{country.name === '' ? <p>Loading...</p> : <p>Yoyo: {country.name} </p>}</div>
      <div>{country.funfact}</div>
      <form>
        <label>
          Guess:
          <input type='text' name='test' className='text-black'></input>
        </label>
        <input type='submit' value='Submit'></input>
      </form>
    </div>
  );
}

export default App;
