import React, { useEffect, useState } from 'react';
import { apiURI } from '../main';
import Select from 'react-select';

export let inputPresent = false;

export function resetInput() {
  inputPresent = false;
}

export const Input = (props) => {
  const [options, setOptions] = useState([]);

  const evaluateClosestGuess = (inQuestion) => {
    if (inQuestion.distance < props.data.closest.distance) {
      if (inQuestion.distance === 0) {
        props.data.setVictory(true);
      }
      props.data.setClosest(inQuestion);
    }
  };

  const handleSubmit = (input) => {
    const guess = input.label.replaceAll(' ', '+').toLowerCase();

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
        props.data.setGuesses((x) => [...x, res]);
        evaluateClosestGuess(res);
        inputPresent = true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const populateOptions = () => {
    fetch(`${apiURI}/country/countries`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Response was not ok: ' + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        setOptions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    populateOptions();
  }, []);

  return (
    <Select
      menuPlacement='top'
      placeholder='Make a guess'
      onChange={handleSubmit}
      options={options}
      openMenuOnClick={false}
      styles={{
        menuList: (base) => ({
          ...base,
          maxHeight: '20vh',
        }),
      }}
    />
  );
};
