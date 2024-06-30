import { useEffect, useState } from 'react';
import { VictoryBoxInfo } from './VictoryBoxInfo';

export const VictoryBox = (props) => {
  const country = props.data.guess.country;
  const [state, setState] = useState(true);
  const [flag, setFlag] = useState();

  useEffect(() => {
    const iso2 = country.iso2.toLowerCase();
    setFlag(`https://flagcdn.com/${iso2}.svg`);
  }, []);

  return (
    <div className='flex flex-col bg-white rounded-t-md'>
      <div className='m-3'>
        <div className='flex justify-between items-center max-h-24 pb-2'>
          <p className='font-bold text-xl'>{country.name} er korrekt!</p>
          <img src={flag} width='60' className='rounded-sm' />
        </div>
        <button onClick={() => setState(!state)}>{state ? 'Statestikke' : 'Info'}</button>
        {state ? <VictoryBoxInfo country={country} /> : <div>yo</div>}
      </div>
    </div>
  );
};
