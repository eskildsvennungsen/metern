import React, { useEffect } from 'react';
import { useState } from 'react';
import { Input } from '../components/Input';
import { MyGlobe } from '../components/MyGlobe';
import { VictoryBox } from '../components/VictoryBox';
import { InfoBox } from '../components/InfoBox';
import { apiURI } from '../main';
import Starfield from '../components/Stars';

export function getDate() {
  return new Date().toISOString().split('T')[0];
}

const Game = () => {
  const [guess, setGuess] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [closest, setClosest] = useState({ country: 0, distance: 1000000 });
  const [victory, setVictory] = useState(false);
  const [loadStorage, setLoadStorage] = useState(false);
  const [storage, setStorage] = useState(() => {
    const data = localStorage.getItem('guesses');
    return data ? JSON.parse(data) : { countries: [], date: getDate() };
  });

  const data = {
    guess,
    setGuess,
    guesses,
    setGuesses,
    closest,
    setClosest,
    victory,
    setVictory,
    storage,
    loadStorage,
  };

  async function getStorageDbEntries() {
    const query = storage.countries
      .map((value) => {
        return `iso3[]=${value.iso3}`;
      })
      .join('&');

    const iso3 = storage.countries.map((e) => e.iso3);

    const data = await fetch(`${apiURI}/country/get?${query}`)
      .then((res) => res.json())
      .then((guesses) => {
        let load = guesses
          .map((e) => {
            const distance = storage.countries.filter((item) => item.iso3 === e.iso3)[0].distance;
            return { country: e, distance: distance };
          })
          .sort((a, b) => iso3.indexOf(a.country.iso3) - iso3.indexOf(b.country.iso3));
        return load;
      });

    if (data.length === 1) {
      if (data[0].distance === -1) setVictory(true);
      setClosest(data[0]);
    } else {
      setClosest(
        [...data].reduce((low, curr) => {
          if (curr['distance'] === -1) setVictory(true);
          return curr['distance'] < low['distance'] ? curr : low;
        })
      );
    }

    setGuesses(data);
    setLoadStorage(true);
  }

  useEffect(() => {
    if (guess === 0) return;

    let clone = storage;
    clone['countries'] = [...clone.countries, { iso3: guess.country.iso3, distance: guess.distance }];

    localStorage.setItem('guesses', JSON.stringify(clone));
    setStorage(clone);
  }, [guess]);

  useEffect(() => {
    if (storage.countries.length === 0) return;
    const today = getDate();

    if (storage.date != today) {
      const x = {
        countries: [],
        date: today,
      };
      setStorage(x);
      localStorage.setItem('guesses', JSON.stringify(x));
    } else {
      getStorageDbEntries();
    }
  }, []);

  return (
    <div className='flex justify-center h-[100dvh] w-screen'>
      <Starfield starCount={5000} starColor={[255, 255, 255]} speedFactor={0.005} />
      <div className='flex flex-col space-y-2 w-full sm:w-5/6 sm:max-w-xl'>
        <div className='flex-none'>{victory ? <VictoryBox data={data} /> : <InfoBox data={data} />}</div>
        <div className='grow'>
          <div className='h-full grid grid-cols-1 place-content-center justify-items-center'>
            <MyGlobe data={data} />
          </div>
        </div>
        {!victory && (
          <div className='flex-none h-20 w-11/12 sm:w-5/6 sm:max-w-xl mx-auto'>
            <Input data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

//<div className='flex justify-center overflow-hidden select-none'>
//  <div className='w-full sm:w-5/6 sm:max-w-xl z-50'>
//    {victory ? <VictoryBox data={data} /> : <InfoBox data={data} />}
//  </div>
//  <div className='w-screen h-3/4 bg-coco absolute'>
//  </div>
//  <div className='bottom-5 fixed w-11/12 mx-auto sm:w-5/6 sm:max-w-xl'>{!victory && <Input data={data} />}</div>
//</div>
export default Game;
