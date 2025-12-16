import React, { useEffect, useState } from "react";

const Title = () => {
  const titleText = "Jazz on the Moon";
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex items-center justify-center font-[Berdiolla] h-screen bg-transparent">
      <h1 className="text-white text-4xl md:text-6xl lg:text-8xl font-bold tracking-widest text-center">
        {titleText.split(" ").map((word, wordIndex) => (
          <span
            key={wordIndex}
            className={`${word.toLowerCase() === "moon" ? "text-[#704995]" : ""} inline-block mx-1 md:mx-2`}
          >
            {word}
            {wordIndex < titleText.split(" ").length - 1 ? " " : ""}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default Title;