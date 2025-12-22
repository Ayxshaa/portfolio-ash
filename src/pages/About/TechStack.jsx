import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TechStack = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const techStacks = [
    { id: 1, name: 'React', icon: '/icons/react.svg', color: '#61DAFB' },
    { id: 2, name: 'Node.js', icon: '/icons/nodejs.svg', color: '#68A063' },
    { id: 3, name: 'MongoDB', icon: '/icons/mongodb.svg', color: '#13AA52' },
    { id: 4, name: 'Three.js', icon: '/icons/threejs.svg', color: '#000000' },
    { id: 5, name: 'Tailwind', icon: '/icons/tailwindcss.svg', color: '#06B6D4' },
    { id: 6, name: 'Framer', icon: '/icons/framer-motion.svg', color: '#0055FF' },
    { id: 7, name: 'JavaScript', icon: '/icons/javascript.svg', color: '#F7DF1E' },
    { id: 8, name: 'TypeScript', icon: '/icons/typescript.svg', color: '#3178C6' },
  ];

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % techStacks.length);
    }, 3500); // Rotate every 3.5 seconds

    return () => clearInterval(interval);
  }, [isInView, techStacks.length]);

  const isActive = (index) => index === activeIndex;

  return (
    <div
      ref={sectionRef}
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Orbital Arc Container - Right Aligned & Clipped */}
      <div className="relative w-full h-96 flex items-center justify-end overflow-hidden pr-12">
        
        {/* SVG Arc Path with Clipping */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          {/* Clipping path for right-aligned circular arc */}
          <defs>
            <clipPath id="arcClip" clipPathUnits="objectBoundingBox">
              <path d="M 1, 0 L 1, 1 L 0.3, 1 Q 0.3, 0.5 1, 0 Z" />
            </clipPath>
          </defs>
          
          {/* Orbital circle outline */}
          <circle
            cx="85%"
            cy="50%"
            r="180"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="1.5"
            opacity="0.3"
            clipPath="url(#arcClip)"
          />
          
          {/* Gradient for the arc */}
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#704995" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tech Stack Items on Orbital Path */}
        <div className="relative w-full h-full flex items-center justify-center">
          {techStacks.map((tech, index) => {
            const isItemActive = isActive(index);
            const totalItems = techStacks.length;
            
            // Calculate position on circular arc
            // 180 degrees arc, starting from top-right going down and around to bottom
            const startAngle = -90; // Start from top
            const arcSpan = 180; // 180 degree arc
            const angle = startAngle + (index / totalItems) * arcSpan;
            
            const radius = 180;
            const centerX = 85; // Right-aligned center (85% from left)
            const centerY = 50; // Middle vertically
            
            // Calculate rotation progress for smooth animation
            const rotationProgress = (activeIndex + (index - activeIndex + totalItems) % totalItems) / totalItems;
            const rotatedAngle = startAngle + (rotationProgress * arcSpan);
            
            const x = centerX + (Math.cos((rotatedAngle * Math.PI) / 180) * radius) / 100;
            const y = centerY + (Math.sin((rotatedAngle * Math.PI) / 180) * radius) / 100;

            return (
              <motion.div
                key={tech.id}
                className="absolute w-24 h-24 flex items-center justify-center"
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                {/* Tech Logo Card */}
                <div
                  className={`w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    isItemActive
                      ? 'bg-gradient-to-br from-[#704995]/80 via-pink-500/40 to-purple-600/50 shadow-2xl shadow-purple-500/60 border border-purple-400/80 scale-110'
                      : 'bg-gray-900/30 border border-gray-700/40'
                  }`}
                >
                  <motion.img
                    src={tech.icon}
                    alt={tech.name}
                    className="w-14 h-14 object-contain"
                    style={{
                      filter: isItemActive ? 'grayscale(0%) brightness(1.2)' : 'grayscale(100%) brightness(0.6)',
                      transform: (tech.name === 'Framer' || tech.name === 'Three.js') ? 'rotate(90deg)' : (tech.name === 'Vite' || tech.name === 'TypeScript' || tech.name === 'JavaScript') ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    animate={{
                      filter: isItemActive
                        ? 'grayscale(0%) brightness(1.2)'
                        : 'grayscale(100%) brightness(0.6)',
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechStack;