import React, { useEffect, useState } from "react";
import { constructShareable } from "../utilities/shareable";

export const Share = (props) => {
    const [results, setResults] = useState([]);
    const [title, setTitle] = useState();
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        if (navigator.canShare) {
            let str = results.map((item) => {
                return item.square + item.direction;
            }).join('%0a');

            navigator.share({
                url: 'https://metern.no',
                text: str,
                title: title
            })
        } else {
            let str = results.map((item) => {
                return item.square + item.direction;
            }).join('\n');

            navigator.clipboard.writeText(str);
            setCopied(!copied);
        }
    };

    useEffect(() => {
        const res = constructShareable(props.data.guesses);
        setResults(res);
        setTitle('Metern #' + "XX" + ' - ' + (props.stats.guesses + 1) + '/10');
    }, []); 

    return (
        <div className='w-screen overflow-scroll text-cream bg-khaki p-6 outline outline-4 outline-offset-0 outline-cherry'>
            <div className='grid gap-y-3'>
                <div>
                <p className='text-2xl text-orange'>{title}</p>
                <p className='text-wrap text-lg p-2'>
                    {results.map((item, index) => {
                        return <span key={index}>{item.square}{item.direction}<br/></span>
                    })}
                </p>
                </div>
                <div>
                    {copied ? <p>Kopiert!</p> :
                    <button 
                        className='outline outline-4 outline-coco outline-offset-0 px-3 py-2 text-l font-black text-coco hover:bg-cherry my-auto '
                        onClick={handleShare}
                    >
                        Del
                    </button>}
                </div>
            </div>
        </div>
    );
};