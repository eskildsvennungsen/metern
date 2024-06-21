import { useEffect, useState } from 'react';

const getClosestGuess = (guesses, closest ,setClosest) => {
  guesses.forEach(guess => {
    if (guess.distance < closest.distance)
      {
        setClosest(guess);
      }
  });
}

const displayText = (closest) => {
  if (closest.distance == 0) {
    return (
      <div>
        <p>{closest.country.name} is correct!</p>
        <p>Did you know: {closest.country.funfact}</p>
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
        <p>Closest guess: {closest.country.name}<br/>Distance: {closest.distance}</p>
      </div>
    );
  }
}

export const Presenter = (props) => {
  const [closest, setClosest] = useState({"country": 0, "distance": 100000});

  useEffect(() => {
    getClosestGuess(props.data.guesses, closest, setClosest);
  }, [props.data.guesses]);

  return displayText(closest);
};
