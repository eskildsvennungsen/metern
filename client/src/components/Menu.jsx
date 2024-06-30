import { useClickAway } from "react-use";
import { useRef } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Squash as Hamburger } from "hamburger-react";
import { InfoBox } from "./InfoBox";

export const Menu = (props) => {
    const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, () => setOpen(false));

  return (
    <div ref={ref}>
      <Hamburger rounded={true} toggled={isOpen} size={20} toggle={setOpen} color="white" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed right-0 shadow-4xl p-2 m-2 bg-neutral-50 border border-black max-h-64 sm:w-5/6 sm:max-w-xl overflow-scroll"
          >
            <ul className="grid gap-2 p-2">
              <li className="w-full p-[0.08rem] rounded-xl">
                { 
                  props.data.guesses.length > 0 ?
                  <InfoBox data={props.data} /> :
                  <p>Her vil land du gjetter dukke opp etter hvert..</p>  
                }
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};