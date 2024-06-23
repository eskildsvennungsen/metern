import Globe from 'react-globe.gl';
import globeImage from '../assets/plain.jpg';
import { useEffect, useState, useRef } from 'react';

export const MyGlobe = (props) => {
  const thisGlobe = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();

  async function assignColors() {
    props.data.guesses.map((guess) => {
      countries.features.map((feature) => {
        if (feature.properties.NAME_LONG.toLowerCase() === guess.country.name.toLowerCase()) {
          feature.properties.polygonCapColor = distanceColor(guess.distance);
        }
      });
    });
  }

  function distanceColor(distance) {
    const distanceCap = 13000; // KM, after 12k the color is just assigned red
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
      redValue = Math.floor(coloBase * normalizedPostTP);
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

  // will rotate the view to this point
  //const MAP_CENTER = { lat: 37.6, lng: -16.6, altitude: 0.4 };
  //thisGlobe.current.pointOfView(MAP_CENTER, 10000);

  assignColors();

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
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    />
  );
};
