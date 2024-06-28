export const InfoBox = (props) => {
  const guess = props.data.guess;

  if (guess) {
    return (
      <div className='bg-white'>
        <p>
          Closest guess: {guess.country.name}
          <br />
          Distance: {guess.distance} km
        </p>
      </div>
    );
  }
};
