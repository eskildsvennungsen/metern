import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const apiURI = 'https://api.metern.no';

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
    async function getTimesPlayed() {
      try {
        const ammount = await fetch(`${apiURI}/country/played`)
          .then((res) => res.json())
          .then((data) => data.played);
        setPlayed(ammount);
      } catch (error) {
        console.log(error);
      }
    }
    getTimesPlayed();
  });

  return (
    <div className='bg-color-primary'>
      <div className='flex justify-center items-center h-screen'>
        <div className='flex flex-col space-y-4'>
          <p className='text-9xl'>METERN</p>
          <p className='text-5xl'>GUESS TODAYS COUNTRY</p>
          <div className='flex justify-content px-8 w-48'>
            <Link to='/game' relative='path' className='bg-black text-white w-full pl-2'>
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
