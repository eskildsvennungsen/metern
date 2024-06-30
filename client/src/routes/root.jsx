import React from 'react';
import Logo from '../assets/METERN.svg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiURI } from '../main';

const Root = () => {
  const [date, setDate] = useState(getDate());
  const [played, setPlayed] = useState('');

  function getDate() {
    const norskeMåneder = [
      'Januar',
      'Februar',
      'Mars',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    try {
      const today = new Date();
      const day = today.getDate();
      const month = norskeMåneder[today.getMonth()];
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
    <div className='bg-color-primary h-screen'>
      <div className='flex justify-center items-center px-10 h-full m-auto'>
        <div className='flex flex-col space-y-8'>
          <div>
            <img src={Logo} alt='METERN' className='w-full' />
            <p className='text-4xl sm:text-5xl'>GJETT DAGENS LAND</p>
          </div>
          <div className='space-y-1'>
            <div className='grid justify-items-center w-36 bg-black pl-3 py-2 w-1/2'>
              <Link to='/game' relative='path' className='text-white w-full text-xl'>
                SPILL
              </Link>
            </div>
            <p className='font-extrabold'>{date}</p>
            <p>Nr. {played}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
