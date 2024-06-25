import { useEffect, useState } from 'react';

const getClosestGuess = (guesses, closest, setClosest) => {
  guesses.forEach((guess) => {
    if (guess.distance < closest.distance) {
      setClosest(guess);
    }
  });
};

const displayText = (closest, props) => {
  if (closest.distance == 0) {
    props.data.setGameState(false);

    return (
      <div className='flex flex-col px-5'>
        <p className='font-bold text-xl'>{closest.country.name} is correct!</p>
        <div className='text-left'>
          <p className='border-b-4 border-stone-950'>Did you know</p>
          <div className='px-1 bg-green-200 rounded-b-sm'>{closest.country.funfact}</div>
          <p className='border-b-4 border-stone-950'>Location</p>
          <p className='px-1 bg-green-200 rounded-b-sm'>{closest.country.location}</p>
          <p className='border-b-4 border-stone-950'>Capital</p>
          <p className='px-1 bg-green-200 rounded-b-sm'>{closest.country.capital}</p>
          <p className='border-b-4 border-stone-950'>Currency</p>
          <p className='px-1 bg-green-200 rounded-b-sm'>{closest.country.currency}</p>
        </div>
      </div>
    );
  } else if (closest.country == 0) {
    return (
      <div>
        <p>Make a guess to play the game!</p>
      </div>
    );
  } else {
    return (
      <div>
        <p>
          Closest guess: {closest.country.name}
          <br />
          Distance: {closest.distance} km
        </p>
      </div>
    );
  }
};

export const Presenter = (props) => {
  const [closest, setClosest] = useState({ country: 0, distance: 100000 });

  useEffect(() => {
    getClosestGuess(props.data.guesses, closest, setClosest);
  }, [props.data.guesses]);

  return displayText(closest, props);
};
