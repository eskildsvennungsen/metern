import React from 'react';

const apiURI = 'http://localhost:4000';

export const Input = (props) => {
  const handleSubmit = async (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const guess = formJson.newGuess;

    fetch(`${apiURI}/country/check?target=${guess}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Response was not ok: ' + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        const arr = props.data.guesses.concat({ country: guess, distance: data.distance });
        props.data.setGuesses(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form className='opacity-100' method='post' onSubmit={handleSubmit}>
      <label>
        <input className='text-black text-center' name='newGuess' />
      </label>
      <hr />
      <button type='submit'>Submit</button>
    </form>
  );
};
