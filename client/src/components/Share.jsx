import React, { useEffect, useState } from "react";
import { constructShareable } from "../utilities/shareable";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { apiURI } from '../main';

export const Share = (props) => {
    const [results, setResults] = useState();
    const [copied, setCopied] = useState(false);

    const readyResults = async () => {
        try {
            await fetch(`${apiURI}/country/load`)
                    .then((res) => res.json())
                    .then((data) => {
                        const numOfGuesses = props.data.guesses.length; // If this is done inline, it will sometimes return 0 for guesses
                        const title = 'Metern ' + data.played + ' ' + numOfGuesses + '/10\n\n';
                        const shareable = constructShareable(props.data.guesses).map((item) => {
                                                return item.square + item.direction;
                                            }).join('\n');
                        setResults(title + shareable);
                    });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        readyResults();
    }, []); 

    return (
        <div className='w-screen font-black text-coco p-2'>
            <CopyToClipboard text={results} onCopy={() => setCopied(!copied)}>
                <button className='outline outline-3 outline-coco outline-offset-0 w-1/2 sm:w-1/4 py-2 text-l hover:bg-green-100 my-auto'>
                    DEL RESULTAT
                </button>
            </CopyToClipboard>
            {copied ? 
                <span className='px-6 delay-300 animate-fade opacity-0' onAnimationEnd={() => setCopied(false)}>
                    Kopiert!
                </span>
            : null}
        </div>
    );
};