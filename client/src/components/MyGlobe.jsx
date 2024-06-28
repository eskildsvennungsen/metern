import Globe from 'react-globe.gl';
import globeImage from '../assets/water.jpg';
import GeoJson from '../assets/data.json';
import { useEffect, useState, useRef } from 'react';
import { inputPresent, resetInput } from './Input';

export const MyGlobe = (props) => {
  const thisGlobe = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [width, setWidth] = useState(window.innerWidth);
  const [heigth, setHeight] = useState(window.innerHeight);

  window.addEventListener('resize', handleResize);

  function handleResize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  function assignColors() {
    const guess = props.data.guess;
    countries.features.map((feature) => {
      if (feature.properties.SOVEREIGNT.toLowerCase() === guess.country.name.toLowerCase()) {
        feature.properties.polygonCapColor = distanceColor(guess.distance);
      }
    });
  }

  function distanceColor(distance) {
    const distanceCap = 5000; // distance in KM
    if (distance > distanceCap) {
      return 'rgba(150,0,0,1)';
    }

    if (distance === 0) {
      return 'rgba(111,232,90,1)';
    }

    const turningPoint = distanceCap * 0.4;
    const coloBase = 255;
    let redValue = 0;
    let greenValue = 0;

    if (distance > turningPoint) {
      const normalizedPreTP = (distance - turningPoint) / (distanceCap - turningPoint);
      redValue = coloBase;
      greenValue = Math.floor(coloBase * (1 - normalizedPreTP));
    } else {
      const normalizedPostTP = distance / turningPoint;
      const color = Math.floor(coloBase * normalizedPostTP);
      const colorThreshold = 200;
      redValue = color > colorThreshold ? color : colorThreshold;
      greenValue = coloBase;
    }

    return `rgba(${redValue},${greenValue},0,1)`;
  }

  if (inputPresent) {
    const guess = props.data.guess.country;
    const rotaionPoint = { lat: guess.latitude, lng: guess.longitude, altitude: 1.8 };
    thisGlobe.current.pointOfView(rotaionPoint, 800);
    assignColors();
    resetInput();
  }

  useEffect(() => {
    setCountries(GeoJson);
  }, []);

  return (
    <Globe
      ref={thisGlobe}
      width={width}
      height={heigth}
      globeImageUrl={globeImage}
      backgroundColor='rgba(0,0,0,0)'
      polygonsData={countries.features.filter((d) => d.properties.ISO_A2 !== 'AQ')}
      polygonCapColor={(d) => d.properties.polygonCapColor || '#FED8B1'}
      polygonSideColor={() => '#b08b64'}
      polygonStrokeColor={() => '#111'}
      showAtmosphere={false}
      altitude={1.8}
      animateIn={false}
    />
  );
};
