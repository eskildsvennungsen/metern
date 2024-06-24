import Globe from 'react-globe.gl';
import globeImage from '../assets/water.jpg';
import { useEffect, useState, useRef } from 'react';
import { inputPresent, resetInput } from './Input';

export const MyGlobe = (props) => {
  const thisGlobe = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();

  function assignColors() {
    const guess = props.data.guess;
    countries.features.map((feature) => {
      if (feature.properties.SOVEREIGNT.toLowerCase() === guess.country.name.toLowerCase()) {
        feature.properties.polygonCapColor = distanceColor(guess.distance);
      }
    });
  }

  function distanceColor(distance) {
    const distanceCap = 13000; // distance in KM
    if (distance > distanceCap) {
      return 'rgba(150,0,0,1)';
    }

    if (distance === 0) {
      return 'rgba(111,232,90,1)';
    }

    const turningPoint = distanceCap * 0.4;
    const coloBase = 150;
    let redValue = 0;
    let greenValue = 0;

    if (distance > turningPoint) {
      const normalizedPreTP = (distance - turningPoint) / (distanceCap - turningPoint);
      redValue = coloBase;
      greenValue = Math.floor(coloBase * (1 - normalizedPreTP));
    } else {
      const normalizedPostTP = distance / turningPoint;
      const color = Math.floor(coloBase * normalizedPostTP);
      const colorThreshold = 170;
      redValue = color > colorThreshold ? color : colorThreshold;
      greenValue = coloBase;
    }

    return `rgba(${redValue},${greenValue},0,1)`;
  }

  useEffect(() => {
    // load data
    fetch('../../dataset/ne_110m_admin_0_countries.geojson')
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  if (inputPresent) {
    const guess = props.data.guess.country;
    const rotaionPoint = { lat: guess.latitude, lng: guess.longitude, altitude: 1.8 };
    thisGlobe.current.pointOfView(rotaionPoint, 800);
    assignColors();
    resetInput();
  }

  return (
    <Globe
      ref={thisGlobe}
      globeImageUrl={globeImage}
      backgroundImageUrl='//unpkg.com/three-globe/example/img/night-sky.png'
      polygonsData={countries.features.filter((d) => d.properties.ISO_A2 !== 'AQ')}
      polygonAltitude={(d) => (d === hoverD ? 0.03 : 0.01)}
      polygonCapColor={(d) => d.properties.polygonCapColor || '#FED8B1'}
      polygonSideColor={() => 'rgba(255, 255, 255, 1)'}
      polygonStrokeColor={() => '#111'}
      showAtmosphere={false}
      altitude={1.8}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    />
  );
};
