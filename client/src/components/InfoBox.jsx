import { useEffect, useState } from 'react';

export const InfoBox = (props) => {
  const [sortedGuesses, setSortedGuesses] = useState([]);

  useEffect(() => {
    setSortedGuesses([...props.data.guesses].sort((a, b) => a.distance - b.distance));
  }, [props.data.guesses]);

  if (props.data.guesses.length > 0) {
    return (
      <div className='bg-cream font-medium p-3 sm:rounded-b-lg'>
        <div className='flex justify-between mb-2 border-dashed border-b-2 border-orange pb-2 text-coco'>
          <p>
            Nærmest: {props.data.closest.country.name} {props.data.closest.country.emoji}
          </p>
          <p>Avstand: {props.data.closest.distance === 0 ? 'grenser' : <>{props.data.closest.distance} km</>}</p>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-24 overflow-y-auto'>
          {sortedGuesses.map((curr) => {
            return (
              <div className='flex justify-between p-2 bg-coco rounded-lg text-cream' key={curr.country.iso3}>
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
