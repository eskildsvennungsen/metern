import React, { useEffect, useState } from 'react';
import { apiURI } from '../main';
import Select from 'react-select';

export const evaluateClosestGuess = (a, b) => {
  if (a.distance < b.closest.distance) {
    if (a.distance === 0) {
      b.setVictory(true);
    }
    b.setClosest(a);
  }
};

export const Input = (props) => {
  const [options, setOptions] = useState([]);

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
        const guessed = props.data.guesses.some((e) => e.country.iso3 == res.country.iso3);
        if (guessed) return;
        props.data.setGuess(res);
        props.data.setGuesses((x) => [...x, res]);
        evaluateClosestGuess(res, props.data);
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
      placeholder='Land...'
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
