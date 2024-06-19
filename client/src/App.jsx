import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Input } from './components/Input';
import { Presenter } from './components/Presenter';
import { MyGlobe } from './components/MyGlobe';

function App() {

  const [country, setCountry] = useState(0);
  const [guess, setGuess] = useState(0);

  return (
    <div className='overflow-hidden'>
      <div className='bg-slate-700 text-white text-center rounded-md max-w-80 min-w-64 shadow-2xl p-5 z-50 absolute top-4 inset-x-10'>
        <Presenter country={country} setCountry={setCountry} /> 
      </div>
      <div>
        <MyGlobe />
      </div>
      <div className='bg-slate-700 text-white text-center rounded-md max-w-80 min-w-64 shadow-2xl p-5 z-50 absolute bottom-4 inset-x-10'>
        <Input guess={guess} setGuess={setGuess} />
      </div>
    </div>
    
  );
}

export default App;
