import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const names = ["AYESHA QURESHI", "STILL AYESHA", "AYESHA AGAIN"];
const roles = ["FRONTEND", "ANIMATIONS", "UI/UX", "WEB DESIGN"];
const tools = ["THREE.JS", "REACT.JS", "FRAMER MOTION"];

const About = () => {
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentToolIndex, setCurrentToolIndex] = useState(0);

  const handleClick = (setter, length) => {
    setter((prevIndex) => (prevIndex + 1) % length);
  };

  const renderAnimatedName = (currentText, nextText) => {
    const maxLength = Math.max(currentText.length, nextText.length);

    return Array.from({ length: maxLength }).map((_, charIndex) => {
      const currentChar = currentText[charIndex] || " ";
      const nextChar = nextText[charIndex] || " ";

      return (
        <span className="inline-block overflow-hidden" key={charIndex}>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={charIndex + "-" + currentChar}
              initial={{ y: charIndex % 2 === 0 ? -30 : 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: charIndex % 2 === 0 ? 30 : -30, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className={`inline-block font-[JazzFont] ${
                currentChar === " "
                  ? "mx-1 sm:mx-2 md:mx-3"
                  : "tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em]"
              }`}
            >
              {currentChar}
            </motion.span>
          </AnimatePresence>
        </span>
      );
    });
  };

  return (
    <section className="min-h-screen bg-black flex flex-col items-center justify-center relative p-4 text-white w-full">

      {/* Title */}
      <div className="text-center mb-6 sm:mb-8 relative flex justify-center items-center">
        {"ABOUT".split("").map((letter, index) => (
          <span
            key={index}
            className="text-2xl sm:text-3xl md:text-5xl font-[JazzFont] tracking-[0.2em] sm:tracking-[0.3em]"
          >
            {letter}
          </span>
        ))}
      </div>

      <p className="mt-2 sm:mt-4 mb-6 sm:mb-8 text-gray-400 text-xs sm:text-sm font-[JazzFont]">
        (Click on elements below to discover)
      </p>

      <div className="w-full max-w-3xl text-sm sm:text-base md:text-lg text-center px-2 sm:px-4">
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">

          {/* I am */}
          <div className="flex items-center justify-center">
            <span className="text-gray-400 font-[JazzFont] text-xs sm:text-sm md:text-base whitespace-nowrap">
              I am :
            </span>

            {/* FIXED WIDTH + CENTERED */}
            <div className="relative inline-flex justify-start items-center ml-3 w-[260px] sm:w-[300px] md:w-[340px]">

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNameIndex}
                  className="absolute left-0 w-full text-left text-xs sm:text-sm md:text-lg lg:text-xl font-[JazzFont] cursor-pointer whitespace-nowrap overflow-hidden"
                  onClick={() =>
                    handleClick(setCurrentNameIndex, names.length)
                  }
                >
                  {renderAnimatedName(
                    names[currentNameIndex],
                    names[(currentNameIndex + 1) % names.length]
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

          {/* I do */}
          <div className="flex items-center justify-center">
            <span className="text-gray-400 font-[JazzFont] text-xs sm:text-sm md:text-base whitespace-nowrap">
              I do :
            </span>

            <div className="relative inline-flex justify-start items-center ml-3 w-[260px] sm:w-[300px] md:w-[340px]">

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoleIndex}
                  className="absolute left-0 w-full text-left text-xs sm:text-sm md:text-lg lg:text-xl font-[JazzFont] cursor-pointer whitespace-nowrap overflow-hidden"
                  onClick={() =>
                    handleClick(setCurrentRoleIndex, roles.length)
                  }
                >
                  {renderAnimatedName(
                    roles[currentRoleIndex],
                    roles[(currentRoleIndex + 1) % roles.length]
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

          {/* I use */}
          <div className="flex items-center justify-center">
            <span className="text-gray-400 font-[JazzFont] text-xs sm:text-sm md:text-base whitespace-nowrap">
              I use :
            </span>

            <div className="relative inline-flex justify-start items-center ml-3 w-[260px] sm:w-[300px] md:w-[340px]">

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentToolIndex}
                  className="absolute left-0 w-full text-left text-xs sm:text-sm md:text-lg lg:text-xl font-[JazzFont] cursor-pointer whitespace-nowrap overflow-hidden"
                  onClick={() =>
                    handleClick(setCurrentToolIndex, tools.length)
                  }
                >
                  {renderAnimatedName(
                    tools[currentToolIndex],
                    tools[(currentToolIndex + 1) % tools.length]
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;