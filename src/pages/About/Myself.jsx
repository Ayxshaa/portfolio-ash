import React, { useEffect, useRef, useState } from "react";

const Myself = () => {
  // Refs for the elements we want to animate
  const titleRef = useRef(null);
  const textRef = useRef(null);
  
  // State to track visibility
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  
  useEffect(() => {
    // Create observers for title and paragraph
    const titleObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsTitleVisible(true);
          titleObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    const textObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsTextVisible(true);
          textObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    // Start observing
    if (titleRef.current) titleObserver.observe(titleRef.current);
    if (textRef.current) textObserver.observe(textRef.current);
    
    // Cleanup
    return () => {
      if (titleRef.current) titleObserver.unobserve(titleRef.current);
      if (textRef.current) textObserver.unobserve(textRef.current);
    };
  }, []);
  
  // Text content split into words for animation
  const textContent = [
    "Hiee! I am ", 
    { text: "Ayesha", className: "text-white font-bold" }, 
    ", but you can call me ", 
    { text: "Ash", className: "text-purple-400 font-semibold" },
    ". I do ", 
    { text: "Frontend", className: "text-blue-400 font-semibold" }, 
    ", where I love creating websites that bring animations and ",
    { text: "Three.js ", className: "text-blue-500 font-semibold" },
    "magic to life—making them interactive and enhancing user experience. ✨",
    "And if you ever find me not writing code, I'm probably lost in a book 📖 or vibing to ",
    { text: "Jazz music ", className: "text-yellow-400 font-semibold" },
    "that I loveee! 🎷🤍"
  ];

  return (
    <div className="w-full max-w-md p-6 min-h-screen flex flex-col justify-center items-start">
      <h2 
        ref={titleRef}
        className={`text-4xl font-bold tracking-wider font-[JazzFont] transition-opacity duration-1000 ${
          isTitleVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        A S H
      </h2>

      <div 
        ref={textRef}
        className="mt-6 text-lg text-gray-300 leading-relaxed font-[JazzFont]"
      >
        {textContent.map((item, index) => {
          // Calculate delay based on index
          const delay = isTextVisible ? `${index * 0.1}s` : "0s";
          
          if (typeof item === "string") {
            return (
              <span
                key={index}
                className="inline-block transition-all duration-700"
                style={{
                  opacity: isTextVisible ? 1 : 0,
                  transform: isTextVisible ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: delay
                }}
              >
                {item}
              </span>
            );
          } else {
            return (
              <span
                key={index}
                className={`inline-block transition-all duration-700 ${item.className}`}
                style={{
                  opacity: isTextVisible ? 1 : 0,
                  transform: isTextVisible ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: delay
                }}
              >
                {item.text}
              </span>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Myself;