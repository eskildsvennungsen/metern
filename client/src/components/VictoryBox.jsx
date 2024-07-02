import { useEffect, useState } from 'react';
import { VictoryBoxInfo } from './VictoryBoxInfo';
import { VictoryBoxStats } from './VictoryBoxStats';
import { getDate } from '../routes/game';
import { apiURI } from '../main';

export const VictoryBox = (props) => {
  const country = props.data.closest.country;
  const [state, setState] = useState(true);
  const [flag, setFlag] = useState();
  const [data, setData] = useState();
  const [stats, setStats] = useState(() => {
    const stat = localStorage.getItem('stats');
    return stat ? JSON.parse(stat) : { number: 0, guesses: 0, date: '' };
  });

  async function getData() {
    const method = props.data.guess === 0 ? 'GET' : 'PUT';
    const loadedData = await fetch(`${apiURI}/usr/comp?guesses=${props.data.guesses.length}`, {
      method: method,
    }).then((res) => res.json());
    setData(loadedData);
  }

  useEffect(() => {
    if (!data) return;

    const today = getDate();
    if (stats.date === today) return;

    const x = {
      number: data.ammount,
      guesses: props.data.guesses.length,
      date: today,
    };
    setStats(x);
    localStorage.setItem('stats', JSON.stringify(x));
  }, [data]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const iso2 = country.iso2.toLowerCase();
    setFlag(`https://flagcdn.com/${iso2}.svg`);
  }, []);

  return (
    <div className='flex flex-col bg-white sm:rounded-b-lg'>
      <div className='m-3 divide-y divide-slate-300'>
        <div className='flex justify-between items-center max-h-24 pb-2 '>
          <div className='flex items-center gap-3'>
            <img src={flag} width='60' className='rounded-sm' />
            <p className='font-bold text-xl'>{country.name} er korrekt!</p>
          </div>
          <button
            onClick={() => setState(!state)}
            className='bg-sky-600 px-3 py-1 rounded-l-3xl text-white hover:ring-2'
          >
            {state ? 'Ledertavle' : 'Info'}
          </button>
        </div>
        {state ? <VictoryBoxInfo country={country} /> : <VictoryBoxStats data={data} stats={stats} />}
      </div>
    </div>
  );
};
