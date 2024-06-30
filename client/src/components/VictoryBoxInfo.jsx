export const VictoryBoxInfo = (country) => {
  country = country.country;

  return (
    <div className='text-left'>
      <div className='mb-2'>
        <p className='border-b-2 border-stone-950'>Visste du?</p>
        <p className='px-1 bg-green-200 rounded-b-sm'>{country.funfact}</p>
      </div>
      <div className='mb-2'>
        <p className='border-b-2 border-stone-950'>Hovedstad</p>
        <p className='px-1 bg-green-200 rounded-b-sm'>{country.capital}</p>
      </div>
      <div>
        <p className='border-b-2 border-stone-950'>Valutta</p>
        <p className='px-1 bg-green-200 rounded-b-sm'>
          {country.currency_name} ({country.currency_symbol}, {country.currency})
        </p>
      </div>
    </div>
  );
};
