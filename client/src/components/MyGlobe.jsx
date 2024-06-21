import Globe from 'react-globe.gl';
import globeImage from '../assets/gray-earth.png'; //'../assets/earth-day.jpg';
import { useEffect, useState, useRef } from 'react';

export const MyGlobe = (props) => {
  const thisGlobe = useRef();
  const [countries, setCountries] = useState([]);
  const [polyData, setPolyData] = useState([]);
  const [hoverD, setHoverD] = useState();

  const drawPolygons = () => {
    props.data.guesses.forEach(guess => {
      const arr = polyData.concat(countries.find((country) => {
                                  return country.properties.NAME_LONG === guess.country.name;
                                  }));
      setPolyData(arr);
      return;
    })
  };

  useEffect(() => {
    fetch('../../dataset/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(data => setCountries(data.features));
  }, []);

  useEffect(() => {
    drawPolygons();
  }, [props.data.guesses]);

  return (
    <Globe 
      ref={thisGlobe}
      globeImageUrl={globeImage}
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      backgroundColor='#fcfcff'

      polygonsData={polyData} //countries.features}
      polygonAltitude={d => d === hoverD ? 0.03 : 0.01}
      polygonCapColor={d => d === hoverD ? 'steelblue' : 'green'}
      polygonSideColor={() => 'rgba(0, 100, 0, 1)'}
      polygonStrokeColor={() => '#111'}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    />
  );
}