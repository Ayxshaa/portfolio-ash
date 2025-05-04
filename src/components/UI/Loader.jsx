// components/Loader.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loader = ({ onComplete }) => {
  const name = "AYESHA";
  const fullName = "Q U R E S H I";

  const [percent, setPercent] = useState(0);
  const [showFullName, setShowFullName] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        const next = prev + 1;
        if (next === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowFullName(true);
            setTimeout(onComplete, 1500);
          }, 500);
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const visibleLetters = Math.floor((percent / 100) * name.length);

  return (
    <div className="min-h-screen w-screen bg-black flex flex-col justify-center items-center text-purple-500 font-semibold tracking-widest px-4 font-[JazzFont]">
      <AnimatePresence>
        {!showFullName ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 1 } }}
            className="flex flex-col items-center"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl flex space-x-1 sm:space-x-2">
              {name.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: index < visibleLetters ? 1 : 0.2,
                    y: 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-400">
              {percent}%
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="fullname"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-center font-[JazzFont]"
          >
            {fullName}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Loader;
