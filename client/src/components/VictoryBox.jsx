import { useEffect, useState } from 'react';

export const VictoryBox = (props) => {
  const [flag, setFlag] = useState();
  const country = props.data.guess.country;

  useEffect(() => {
    const iso2 = country.iso2.toLowerCase();
    async function getFlag() {
      const res = await fetch(`https://flagcdn.com/w80/${iso2}.png`);
      const flagBlob = await res.blob();
      const flag = URL.createObjectURL(flagBlob);
      setFlag(flag);
    }
    getFlag();
  }, []);

  return (
    <div className='flex flex-col bg-white border-b-lg'>
      <div className='m-3'>
        <div className='flex justify-between items-center max-h-24 pb-2'>
          <p className='font-bold text-xl'>{country.name} is correct!</p>
          <img src={flag} className='rounded-sm' />
        </div>
        <div className='text-left'>
          <div className='mb-2'>
            <p className='border-b-2 border-stone-950'>Did you know</p>
            <p className='px-1 bg-green-200 rounded-b-sm'>{country.funfact}</p>
          </div>
          <div className='mb-2'>
            <p className='border-b-2 border-stone-950'>Capital</p>
            <p className='px-1 bg-green-200 rounded-b-sm'>{country.capital}</p>
          </div>
          <div>
            <p className='border-b-2 border-stone-950'>Currency</p>
            <p className='px-1 bg-green-200 rounded-b-sm'>
              {country.currency_name} ({country.currency_symbol}, {country.currency})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
