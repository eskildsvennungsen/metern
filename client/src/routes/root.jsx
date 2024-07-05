import React from 'react';
import Logo from '../assets/METERN.svg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiURI } from '../main';

const MainMenu = ({ showHelp }) => {
  const [date] = useState(getDate());
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
    <div className='flex flex-col space-y-8 w-max-4/5'>
      <div>
        <img src={Logo} alt='METERN' className='w-full' />
        <p className='font-semibold text-3xl sm:text-6xl text-khaki'>GJETT DAGENS LAND</p>
      </div>
      <div className='space-y-1 text-khaki'>
        <div className='w-full flex justify-between'>
          <button
            onClick={() => showHelp(true)}
            className='outline outline-4 outline-coco outline-offset-0 px-3 py-2 text-2xl font-black text-coco hover:bg-cherry my-auto '
          >
            VEILEDNING
          </button>
          <Link
            to='/game'
            relative='path'
            className='bg-coco px-6 py-3 text-2xl font-black text-cream hover:text-cherry my-auto'
          >
            SPILL
          </Link>
        </div>
        <div className='w-full grid grid-rows-1 place-content-end place-items-end'>
          <p className='font-extrabold'>{date}</p>
          <p>Nr. {played}</p>
        </div>
      </div>
    </div>
  );
};

const HelpMenu = ({ showHelp }) => {
  return (
    <div className='relative text-cream bg-khaki w-1/2 min-w-80 sm:min-w-96 p-6 outline outline-offset-2 outline-cherry'>
      <button className='absolute top-0 right-0 pr-3 pt-1' onClick={() => showHelp(false)}>
        X
      </button>
      <div className='grid gap-y-3'>
        <div>
          <p className='text-2xl text-orange'>Hva er dette?</p>
          <p className='text-wrap text-lg'>
            Dette er en slags quiz som er laget for å skjerpe dine geografiske ferdigheter! Hver dag trekkes det et
            tilfeldig land. Dette landet er likt for ALLE som spiller. Hvor mange forsøk bruker du på å finne frem?
          </p>
        </div>
        <div>
          <p className='text-2xl text-orange'>Spillet går ut på følgende:</p>
          <ul className='list-disc ml-6 mt-1'>
            <li>Start ved å gjette et tilfeldig land.</li>
            <li>Øverst til høyre vil du kunne se hvor langt unna du var dagens fasit.</li>
            <li>Bruk denne kunnskapen for å peile deg frem til riktig svar.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Root = () => {
  const [showHelp, setShowHelp] = useState(false);

  const updateHelpMenu = (state) => {
    setShowHelp(state);
  };

  return (
    <div className='bg-cream h-[100dvh]'>
      <div className='flex justify-center items-center px-10 h-full m-auto'>
        {showHelp ? <HelpMenu showHelp={updateHelpMenu} /> : <MainMenu showHelp={updateHelpMenu} />}
        <div className='flex justify-center absolute bottom-0 bg-coco w-full h-10'>
          <div className='my-auto text-cream'>
            Kontakt: <span className='text-orange'>eskild@metern.no</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
