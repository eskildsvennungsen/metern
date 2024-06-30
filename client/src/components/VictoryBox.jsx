import { useEffect, useState } from 'react';
import { VictoryBoxInfo } from './VictoryBoxInfo';
import { VictoryBoxStats } from './VictoryBoxStats';
import { apiURI } from '../main';

export const VictoryBox = (props) => {
  const country = props.data.guess.country;
  const guesses = props.data.guesses.length;
  const [state, setState] = useState(true);
  const [flag, setFlag] = useState();
  const [data, setData] = useState(0);

  async function getData() {
    const loadedData = await fetch(`${apiURI}/usr/comp?guesses=${guesses}`, {
      method: 'PUT',
    }).then((res) => res.json());
    setData(loadedData);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const iso2 = country.iso2.toLowerCase();
    setFlag(`https://flagcdn.com/${iso2}.svg`);
  }, []);

  return (
    <div className='flex flex-col bg-white rounded-t-md'>
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
            {state ? 'Statestikke' : 'Info'}
          </button>
        </div>
        {state ? <VictoryBoxInfo country={country} /> : <VictoryBoxStats data={data} guesses={guesses} />}
      </div>
    </div>
  );
};
