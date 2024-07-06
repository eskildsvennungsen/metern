import React, { useEffect, useState } from 'react';
import { apiURI } from '../main';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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
        const newGuesses = [...props.data.guesses, res];

        if (newGuesses.length === 1) {
          if (res.distance === -1) props.data.setVictory(true);
          props.data.setClosest(res);
        } else {
          props.data.setClosest(
            [...newGuesses].reduce((low, curr) => {
              if (curr['distance'] === -1) props.data.setVictory(true);
              return curr['distance'] < low['distance'] ? curr : low;
            })
          );
        }
        props.data.setGuess(res);
        props.data.setGuesses(newGuesses);
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
    <div className='w-fill bg-white p-1.5 rounded-md'>
      <Autocomplete
        id='country'
        options={options}
        autoHighlight
        clearOnEscape
        slotProps={{ clearIndicator: { type: 'button' } }}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box key={key} component='li' {...optionProps}>
              {option.label}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Velg et land'
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
        onChange={(e, v) => {
          if (v === null) return;
          handleSubmit(v);
        }}
      />
    </div>
  );
};
