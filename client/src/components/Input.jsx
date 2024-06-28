import React from 'react';
import { apiURI } from '../main';

export let inputPresent = false;

export function resetInput() {
  inputPresent = false;
}

export const Input = (props) => {
  const evaluateClosestGuess = (inQuestion) => {
    if (inQuestion.distance < props.data.closest.distance) {
      if (inQuestion.distance === 0) {
        props.data.setVictory(true);
      }
      props.data.setClosest(inQuestion);
    }
  };

  const handleSubmit = async (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const guess = formJson.newGuess.replaceAll(' ', '+');

    fetch(`${apiURI}/country/check?target=${guess}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Response was not ok: ' + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        const res = { country: data.country, distance: data.distance };
        props.data.setGuess(res);
        evaluateClosestGuess(res);
        inputPresent = true;
      })
      .catch((error) => {
        console.log(error);
      });

    e.target.reset();
  };

  return (
    <form
      className='opacity-100 flex items-start gap-3 items-center mb-2'
      autoComplete='off'
      method='post'
      onSubmit={handleSubmit}
    >
      <input
        id='guess-field'
        type='text'
        name='newGuess'
        className='block relative bg-white rounded-md px-3 pb-2.5 pt-3 w-full text-s text-gray-900 rounded-lg dark:text-black'
        placeholder='Your Guess'
      />
    </form>
  );
};
