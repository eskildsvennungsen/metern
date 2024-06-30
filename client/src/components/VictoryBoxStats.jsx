export const VictoryBoxStats = (props) => {
  props.data.avgGuesses = Number(props.data.avgGuesses.toFixed(1));

  const numberOne = () => {
    return (
      <div className='mx-auto w-max text-xl mt-3'>
        <span className='font-bold bg-emerald-700 text-white px-3 py-1 rounded-md'>Gratulerer!</span> Du er dagens
        første til å gjette riktig.
      </div>
    );
  };

  const defaultScreen = () => {
    return (
      <ul className='mt-3 ml-5 max-w-md space-y-1 list-disc'>
        <li>
          Du var <span className='px-2 bg-sky-800 text-white rounded-md'>nr. {props.data.ammount}</span> til å gjette
          dagens land
        </li>
        <li>
          Dette greide du på <span className='px-2 bg-sky-800 text-white rounded-md'>{props.guesses} forsøk</span>
        </li>
        <li>
          Gjennomsnittelig mengde forsøk er{' '}
          <span className='px-2 bg-sky-800 text-white rounded-md'>{props.data.avgGuesses} forsøk</span>
        </li>
        <li>
          Tilsammen har <span className='px-2 bg-sky-800 text-white rounded-md'>{props.data.totGuesses} forsøk</span>{' '}
          blitt gjort
        </li>
      </ul>
    );
  };

  return <div>{props.data.ammount === 1 ? numberOne() : defaultScreen()}</div>;
};
