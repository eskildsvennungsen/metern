import React from 'react';

export const Input = (props) => {

    return(     
        <form className='opacity-100'>
            <label>
                Guess:
                <input type='text' name='test' className='text-black'></input>
            </label>
            <input type='submit' value='Submit'></input>
        </form>
    )
}

