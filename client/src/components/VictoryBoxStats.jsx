export const VictoryBoxStats = (props) => {
  props.data.avgGuesses = Math.ceil(Number(props.data.avgGuesses.toFixed(1)));

  const numberOne = () => {
    return (
      <div className='flex justify-center w-full text-lg mt-3 text-wrap leading-8'>
        <p>
          <span className='font-bold bg-emerald-700 text-white px-1 py-0.5 rounded-md'>Gratulerer!</span> Du er dagens
          første til å gjette riktig. Det tok deg{' '}
          <span className='font-bold bg-emerald-700 text-white px-1 py-0.5 rounded-md'>
            {props.stats.guesses} forsøk
          </span>
          .
        </p>
      </div>
    );
  };

  const defaultScreen = () => {
    return (
      <ul className='mt-3 ml-5 max-w-md space-y-1 list-disc'>
        <li>
          Du var <span className='px-2 bg-sky-800 text-white rounded-md'>nr. {props.stats.number}</span> til å gjette
          dagens land.
        </li>
        <li>
          Dette greide du på <span className='px-2 bg-sky-800 text-white rounded-md'>{props.stats.guesses} forsøk</span>
          .
        </li>
        <li>
          Tilsammen har <span className='px-2 bg-sky-800 text-white rounded-md'>{props.data.totGuesses} forsøk</span>{' '}
          blitt gjort i dag.
        </li>
        <li>
          Spillere har i gjennomsnitt brukt{' '}
          <span className='px-2 bg-sky-800 text-white rounded-md'>{props.data.avgGuesses} forsøk</span> på dette landet.
        </li>
      </ul>
    );
  };

  return <div>{props.data.ammount === 1 ? numberOne() : defaultScreen()}</div>;
};
