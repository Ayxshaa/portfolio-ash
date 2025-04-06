import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const names = ["AYESHA QURESHI", "STILL AYESHA", "AYESHA AGAIN"];
const roles = ["FRONTEND & DESIGNING", "UI/UX & ANIMATIONS"];
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
              key={currentChar + nextChar}
              initial={{ y: charIndex % 2 === 0 ? -30 : 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: charIndex % 2 === 0 ? 30 : -30, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`inline-block font-[JazzFont] ${
                currentChar === " " ? "mx-3" : "tracking-[0.3em] sm:tracking-[0.2em] md:tracking-[0.3em]"
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
      <div className="text-center mb-8 relative flex justify-center items-center">
        {"ABOUT".split("").map((letter, index) => (
          <span
            key={index}
            className="text-2xl sm:text-3xl md:text-5xl font-[JazzFont] tracking-[0.2em] sm:tracking-[0.3em]"
          >
            {letter}
          </span>
        ))}
      </div>

      <p className="mt-4 mb-8 text-gray-400 text-xs sm:text-sm font-[JazzFont]">
        (Click on elements below to discover)
      </p>

      <div className="w-full max-w-3xl text-base sm:text-lg text-center md:text-left px-4">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Animated Name */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start">
            <span className="text-gray-400 font-[JazzFont] mb-2 sm:mb-0">I am :</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={names[currentNameIndex]}
                className="sm:ml-4 text-lg sm:text-xl font-[JazzFont] cursor-pointer overflow-hidden"
                onClick={() => handleClick(setCurrentNameIndex, names.length)}
              >
                {renderAnimatedName(
                  names[currentNameIndex],
                  names[(currentNameIndex + 1) % names.length]
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Animated "I do" Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start">
            <span className="text-gray-400 font-[JazzFont] mb-2 sm:mb-0">I do :</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={roles[currentRoleIndex]}
                className="sm:ml-4 text-lg sm:text-xl font-[JazzFont] cursor-pointer overflow-hidden"
                onClick={() => handleClick(setCurrentRoleIndex, roles.length)}
              >
                {renderAnimatedName(
                  roles[currentRoleIndex],
                  roles[(currentRoleIndex + 1) % roles.length]
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Animated "I use" Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start">
            <span className="text-gray-400 font-[JazzFont] mb-2 sm:mb-0">I use :</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={tools[currentToolIndex]}
                className="sm:ml-4 text-lg sm:text-xl font-[JazzFont] cursor-pointer overflow-hidden"
                onClick={() => handleClick(setCurrentToolIndex, tools.length)}
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
    </section>
  );
};

export default About;