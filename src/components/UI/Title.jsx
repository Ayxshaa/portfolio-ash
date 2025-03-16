import React from "react";
import { motion } from "framer-motion";

const Title = () => {
  const titleText = "Jazz on the Moon";

  return (
    <div className="flex items-center justify-center h-screen bg-transparent">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-white text-8xl font-[Berdiolla] tracking-widest flex"
      >
        {titleText.split(" ").map((word, wordIndex) => (
          <span
            key={wordIndex}
            className={word.toLowerCase() === "moon" ? "text-gold" : ""}
          >
            {word.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: (wordIndex * 5 + index) * 0.1, // Adjust timing per word and letter
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            &nbsp; {/* Space between words */}
          </span>
        ))}
      </motion.h1>
    </div>
  );
};

export default Title;
