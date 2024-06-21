import { useState, useEffect } from 'react';
import { dailyNumber } from './dailynumber';

const URI = 'http://localhost:4000';

async function fetchRandomCountry() {
  const res = await fetch(`${URI}/country/today`).then((res) => res.json());
  return res.data;
}

export const Presenter = (props) => {
  let number = dailyNumber(243);

  const [day, setDay] = useState(number);

  useEffect(() => {
    setDay(number);
  });

  useEffect(() => {
    let ignore = false;

    if (props.country !== 0) return;

    async function startFetching() {
      const json = await fetchRandomCountry();
      if (!ignore) {
        props.setCountry(json);
      }
    }

    startFetching();
  }, []);

  return <div>{props.country.name === '' ? <p>Loading...</p> : <p>Yoyo: {props.country.name} </p>}</div>;
};
