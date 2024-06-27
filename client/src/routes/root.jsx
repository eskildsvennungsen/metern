import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiURI } from '../main';

const Root = () => {
  const [date, setDate] = useState(getDate());
  const [played, setPlayed] = useState('');

  function getDate() {
    try {
      const today = new Date();
      const day = today.getDate();
      const month = today.toLocaleString('default', { month: 'long' });
      const year = today.getFullYear();
      return `${day} ${month}, ${year}`;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function initData() {
      try {
        await fetch(`${apiURI}/country/load`)
          .then((res) => res.json())
          .then((data) => setPlayed(data.played));
      } catch (error) {
        console.log(error);
      }
    }
    initData();
  });

  return (
    <div className='bg-color-primary'>
      <div className='flex justify-center items-center h-screen px-5'>
        <div className='flex flex-col space-y-4'>
          <p className='text-7xl sm:text-9xl'>METERN</p>
          <p className='text-4xl sm:text-5xl'>GUESS TODAY'S COUNTRY</p>
          <div className='flex w-36'>
            <Link to='/game' relative='path' className='bg-black pl-3 text-white w-full'>
              PLAY
            </Link>
          </div>
          <p className='font-extrabold'>{date}</p>
          <p>No. {played}</p>
        </div>
      </div>
    </div>
  );
};

export default Root;
