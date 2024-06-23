import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const apiURI = 'http://localhost:4000';

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
      <div>
        <p className='text-9xl'>METERN</p>
        <p className='text-5xl'>Gjett deg frem til dagens land.</p>
        <Link to='/game' relative='path'>
          Spill
        </Link>
        <p className='text-bold'>{date}</p>
        <p>No. {played}</p>
      </div>
    </div>
  );
};

export default Root;
