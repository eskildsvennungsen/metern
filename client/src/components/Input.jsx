import React from 'react';

const apiURI = 'http://localhost:4000';

export const Input = (props) => {

    const handleSubmit = async (e) => {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        
        const res = await fetch(`${apiURI}/country/distance?from=` + formJson.newGuess + `&to=` + props.data.country.name).then((res) => res.json());

        const arr = props.data.guesses.concat({"country": res.a, "distance": res.distance});
        props.data.setGuesses(arr);       
    }

    return(     
        <form className='opacity-100' method="post" onSubmit={handleSubmit}>
            <label>
                <input className='text-black text-center' name="newGuess" />
            </label>
            <hr />
            <button type="submit">Submit</button>
        </form>
    )
}

