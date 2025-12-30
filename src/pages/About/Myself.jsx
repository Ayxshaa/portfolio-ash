import React, { useEffect, useRef, useState } from "react";
import AboutMe from "../../assets/image.png";

const Myself = () => {
  // Refs for the elements we want to animate
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  
  // State to track visibility
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  
  useEffect(() => {
    // Create observers for title, text, and image
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
    
    const imageObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsImageVisible(true);
          imageObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    // Start observing
    if (titleRef.current) titleObserver.observe(titleRef.current);
    if (textRef.current) textObserver.observe(textRef.current);
    if (imageRef.current) imageObserver.observe(imageRef.current);
    
    // Cleanup
    return () => {
      if (titleRef.current) titleObserver.unobserve(titleRef.current);
      if (textRef.current) textObserver.unobserve(textRef.current);
      if (imageRef.current) imageObserver.unobserve(imageRef.current);
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
    <div className="w-full flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 px-4 sm:px-6 py-6 md:py-10">
      
      {/* LEFT SIDE — Image */}
      <div className="w-full md:w-[30%] flex justify-center">
        <img 
          ref={imageRef}
          src={AboutMe}
          alt="About Me" 
          className={`w-full md:w-auto h-auto max-h-[300px] sm:max-h-[400px] object-contain rounded-xl transition-all duration-1000 ${
            isImageVisible 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 -translate-x-10"
          }`}
        />
      </div>

      {/* RIGHT SIDE — Text Content */}
      <div className="w-full md:w-[50%] flex flex-col justify-center items-start max-w-lg">
        <h2
          ref={titleRef}
          className={`text-2xl sm:text-3xl md:text-4xl text-[#704995] font-bold tracking-wider font-[JazzFont] transition-opacity duration-1000 ${
            isTitleVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          A S H
        </h2>

        <div
          ref={textRef}
          className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed font-[JazzFont]"
        >
          {textContent.map((item, index) => {
            const delay = isTextVisible ? `${index * 0.1}s` : "0s";

            if (typeof item === "string") {
              return (
                <span
                  key={index}
                  className="inline-block transition-all duration-700"
                  style={{
                    opacity: isTextVisible ? 1 : 0,
                    transform: isTextVisible ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: delay,
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
                    transitionDelay: delay,
                  }}
                >
                  {item.text}
                </span>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Myself;