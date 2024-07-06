import React, { useEffect, useState } from "react";
import { constructShareable } from "../utilities/shareable";
import { CopyToClipboard } from 'react-copy-to-clipboard';

export const Share = (props) => {
    const [results, setResults] = useState();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const res = constructShareable(props.data.guesses).map((item) => {
            return item.square + item.direction;
        }).join('\n');

        const msg = 'Metern #' + "XX" + ' - ' + (props.stats.guesses + 1) + '/10\n\n' + res;

        setResults(msg);
    }, []); 

    return (
        <div className='w-screen font-black text-coco p-2'>
            <CopyToClipboard text={results} onCopy={() => setCopied(true)}>
                <button className='outline outline-3 outline-coco outline-offset-0 w-1/3 sm:w-1/4 py-2 text-l hover:bg-green-100 focus:bg-green-200 my-auto'>
                    Del resultat
                </button>
            </CopyToClipboard>
            {copied ? <span className='px-6'>Kopiert!</span> : null}
        </div>
    );
};