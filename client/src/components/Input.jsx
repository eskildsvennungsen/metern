import React, { useEffect, useState } from 'react';
import { apiURI } from '../main';
import GeoJson from '../assets/data.json';
import Select from "react-select";

export let inputPresent = false;

export function resetInput() {
  inputPresent = false;
}

export const Input = (props) => {
  const [options] = useState([]);

  const handleSubmit = (input) => {
    const guess = input.value.replaceAll(' ', '+');

    fetch(`${apiURI}/country/check?target=${guess}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Response was not ok: ' + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        const res = { country: data.country, distance: data.distance };
        const arr = props.data.guesses.concat(res);
        props.data.setGuesses(arr);
        props.data.setGuess(res);
        inputPresent = true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    GeoJson.features.map((feature) => {
      options.push({ label: feature.properties.NAME, value: feature.properties.NAME.toLowerCase() });
    });
  }, []);

  return (
    <Select
      menuPlacement='top'
      placeholder='Make a guess'
      onChange={handleSubmit}
      options={options}
      openMenuOnClick={false}
      styles={{
        menuList: base => ({
          ...base,
          maxHeight: '20vh'
        })
      }}
    />
  );
};
