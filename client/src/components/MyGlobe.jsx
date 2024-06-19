import Globe from 'react-globe.gl';
import globeImage from '../assets/earth-day.jpg';
import { useEffect, useState, useRef } from 'react';

export const MyGlobe = (props) => {
  const thisGlobe = useRef();
  const [countries, setCountries] = useState({features: []});
  const [hoverD, setHoverD] = useState();

  useEffect(() => {
    // load data
    fetch('../../dataset/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(data => setCountries(data));
  }, []);

  // will rotate the view to this point
  //const MAP_CENTER = { lat: 37.6, lng: -16.6, altitude: 0.4 }; 
  //thisGlobe.current.pointOfView(MAP_CENTER, 10000); 

  return (
    <Globe 
      ref={thisGlobe}
      globeImageUrl={globeImage}
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
      polygonAltitude={d => d === hoverD ? 0.03 : 0.01}
      polygonCapColor={d => d === hoverD ? 'steelblue' : 'green'}
      polygonSideColor={() => 'rgba(0, 100, 0, 1)'}
      polygonStrokeColor={() => '#111'}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    />
  );
}