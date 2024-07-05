export const VictoryBoxInfo = (country) => {
  country = country.country;

  const data = [
    {
      title: 'Visste du?',
      data: country.funfact,
    },
    {
      title: 'Hovedstad',
      data: country.capital,
    },
    {
      title: 'Valuta',
      data: `${country.currency_name} (${country.currency_symbol}, ${country.currency})`,
    },
  ];

  return (
    <div className='text-left'>
      {data.map((e) => {
        return (
          <div className='mb-2'>
            <p className='border-b-2 border-coco'>{e.title}</p>
            <p className='pl-1 py-1 bg-khaki text-cream rounded-b-sm'>{e.data}</p>
          </div>
        );
      })}
    </div>
  );
};
