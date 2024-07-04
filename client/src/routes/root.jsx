import React from 'react';
import Logo from '../assets/METERN.svg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiURI } from '../main';

const Root = () => {
  const [date, setDate] = useState(getDate());
  const [played, setPlayed] = useState('');

  function getDate() {
    const norwegianMonths = [
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
      const month = norwegianMonths[today.getMonth()];
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
    <div className='bg-creme h-[100dvh]'>
      <div className='flex justify-center items-center px-10 h-full m-auto'>
        <div className='flex flex-col space-y-8 w-max-4/5'>
          <div>
            <img src={Logo} alt='METERN' className='w-full' />
            <p className='font-semibold text-3xl sm:text-6xl text-khaki'>GJETT DAGENS LAND</p>
          </div>
          <div className='space-y-1 text-khaki'>
            <div className='grid justify-items-center w-36 bg-coco pl-3 py-2 w-1/2'>
              <Link to='/game' relative='path' className='w-full text-2xl font-black text-cherry'>
                SPILL
              </Link>
            </div>
            <p className='font-extrabold'>{date}</p>
            <p>Nr. {played}</p>
          </div>
        </div>
        <div className='flex justify-center absolute bottom-0 bg-coco w-full h-10'>
          <div className='my-auto text-creme'>
            Kontakt: <span className='text-orange'>eskild@metern.no</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
