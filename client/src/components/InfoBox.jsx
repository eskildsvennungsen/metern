export const InfoBox = (props) => {
  const guess = props.data.guess;
  const closest = props.data.closest;
  const guesses = props.data.guesses;

  guesses.sort((a, b) => a.distance - b.distance);

  if (guess) {
    return (
      <div className='bg-white p-3 sm:rounded-b-lg'>
        <div className='flex justify-between mb-2 border-dashed border-b-2 border-sky-500 pb-2'>
          <p>
            Nærmest: {closest.country.name} {closest.country.emoji}
          </p>
          <p>Avstand: {closest.distance} km</p>
        </div>
        <div className='grid grid-cols-3 gap-2 max-h-24 overflow-y-auto'>
          {guesses.map((curr) => {
            return (
              <div className='flex justify-between p-2 bg-sky-200 rounded-lg' key={curr.country.iso3}>
                <p>{curr.country.name}</p>
                <span>{curr.country.emoji}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};
