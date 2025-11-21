import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const names = ["AYESHA QURESHI", "STILL AYESHA", "AYESHA AGAIN"];
const roles = ["FRONTEND", "ANIMATIONS", "UI/UX", "WEB DESIGN"];
const tools = ["THREE.JS", "REACT.JS", "FRAMER MOTION"];

const GoldenParticleAbout = () => {
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentToolIndex, setCurrentToolIndex] = useState(0);
  
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const timeRef = useRef(0);
  const hasAnimatedRef = useRef(false);
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

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
              className={`inline-block ${
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
      }
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

  useEffect(() => {
    if (!isInView) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(delay = 0) {
        this.delay = delay;
        this.age = -delay;
        this.lifetime = 3500; // Fixed lifetime for one-time animation
        
        // Much smaller, crisp particles
        this.baseSize = 0.8 + Math.random() * 1.5;
        this.size = this.baseSize;
        
        // Golden color
        this.hue = 38 + Math.random() * 12;
        this.brightness = 65 + Math.random() * 25;
        
        this.depth = Math.random();
        
        // For S-curve flow
        this.flowOffset = Math.random() * 20;
        this.verticalOffset = Math.random() * 100 - 50;
      }
      
      getPosition(time, canvas) {
        const progress = this.age / this.lifetime;
        
        if (progress < 0) return null;
        if (progress > 1) return null;
        
        const w = canvas.width;
        const h = canvas.height;
        
        let x, y, opacity, size;
        
        // Smooth S-curve path from top-left to bottom-right
        const easedProgress = this.easeInOutCubic(progress);
        
        // Start position (top-left area)
        const startX = w * 0.1;
        const startY = h * 0.15;
        
        // End position (bottom-right area)
        const endX = w * 0.9;
        const endY = h * 0.85;
        
        // Linear progression
        x = startX + (endX - startX) * easedProgress;
        y = startY + (endY - startY) * easedProgress;
        
        // Create smooth S-curve wave
        // Using sine wave that creates the flowing S shape
        const waveProgress = progress * Math.PI * 2; // Two full waves for S shape
        const amplitude = Math.min(w, h) * 0.15; // Wave height
        
        // Horizontal wave (creates the S)
        const wave = Math.sin(waveProgress) * amplitude * Math.sin(progress * Math.PI);
        x += wave;
        
        // Add subtle vertical variation
        y += this.verticalOffset * Math.sin(progress * Math.PI);
        
        // Add micro-variations for organic feel
        const microX = Math.sin(progress * Math.PI * 8 + this.flowOffset) * 8;
        const microY = Math.cos(progress * Math.PI * 6 + this.flowOffset) * 6;
        x += microX;
        y += microY;
        
        // Opacity: fade in, stay bright, fade out
        if (progress < 0.1) {
          opacity = progress / 0.1;
        } else if (progress > 0.85) {
          opacity = (1 - progress) / 0.15;
        } else {
          opacity = 0.85 + Math.sin(progress * Math.PI * 3) * 0.15;
        }
        
        // Size variation along the path
        size = this.baseSize * (0.8 + Math.sin(progress * Math.PI) * 0.4);
        
        return { x, y, opacity, size, progress };
      }
      
      easeInOutCubic(t) {
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
      
      update(deltaTime) {
        this.age += deltaTime;
      }
      
      draw(ctx, canvas, time) {
        const pos = this.getPosition(time, canvas);
        if (!pos) return false;
        
        const { x, y, opacity, size } = pos;
        
        // Outer glow (much smaller and crisper)
        const outerGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
        outerGradient.addColorStop(0, `hsla(${this.hue}, 100%, ${this.brightness}%, ${opacity * 0.8})`);
        outerGradient.addColorStop(0.3, `hsla(${this.hue}, 100%, ${this.brightness * 0.7}%, ${opacity * 0.4})`);
        outerGradient.addColorStop(1, `hsla(${this.hue}, 100%, ${this.brightness * 0.5}%, 0)`);
        
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Core bright spot (crisp center)
        const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
        coreGradient.addColorStop(0, `hsla(${this.hue}, 100%, 98%, ${opacity})`);
        coreGradient.addColorStop(0.5, `hsla(${this.hue}, 100%, ${this.brightness}%, ${opacity * 0.8})`);
        coreGradient.addColorStop(1, `hsla(${this.hue}, 100%, ${this.brightness * 0.6}%, ${opacity * 0.3})`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      }
    }

    // Create particles only once
    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      
      const particleCount = 400; // More particles for dense trail
      const totalDuration = 2500; // Stagger over 2.5 seconds
      
      for (let i = 0; i < particleCount; i++) {
        const delay = (i / particleCount) * totalDuration;
        particlesRef.current.push(new Particle(delay));
      }
    }

    let lastTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current = currentTime;

      // Fade trail effect (stronger fade for crisper look)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sort by depth for proper layering
      particlesRef.current.sort((a, b) => a.depth - b.depth);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update(deltaTime);
        return particle.draw(ctx, canvas, currentTime);
      });

      // Stop animation when all particles are done
      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Clear canvas completely when done
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInView]);

  return (
    <section ref={sectionRef} className="min-h-screen bg-black flex flex-col items-center justify-center relative p-4 text-white w-full overflow-hidden font-[JazzFont]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      <div className="relative z-10">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 relative flex justify-center items-center">
          {"ABOUT".split("").map((letter, index) => (
            <span
              key={index}
              className="text-2xl sm:text-3xl md:text-5xl tracking-[0.2em] sm:tracking-[0.3em]"
            >
              {letter}
            </span>
          ))}
        </div>

        <p className="mt-2 sm:mt-4 mb-6 sm:mb-8 text-gray-400 text-xs sm:text-sm text-center">
          (Click on elements below to discover)
        </p>

        <div className="w-full max-w-3xl text-sm sm:text-base md:text-lg text-center px-2 sm:px-4">
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">

            {/* I am */}
            <div className="flex items-center justify-center">
              <span className="text-gray-400 text-xs sm:text-sm md:text-base whitespace-nowrap">
                I am :
              </span>

              <div className="relative inline-flex justify-start items-center ml-3 w-[260px] sm:w-[300px] md:w-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentNameIndex}
                    className="absolute left-0 w-full text-left text-xs sm:text-sm md:text-lg lg:text-xl cursor-pointer whitespace-nowrap overflow-hidden"
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
              <span className="text-gray-400 text-xs sm:text-sm md:text-base whitespace-nowrap">
                I do :
              </span>

              <div className="relative inline-flex justify-start items-center ml-3 w-[260px] sm:w-[300px] md:w-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRoleIndex}
                    className="absolute left-0 w-full text-left text-xs sm:text-sm md:text-lg lg:text-xl cursor-pointer whitespace-nowrap overflow-hidden"
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
              <span className="text-gray-400 text-xs sm:text-sm md:text-base whitespace-nowrap">
                I use :
              </span>

              <div className="relative inline-flex justify-start items-center ml-3 w-[260px] sm:w-[300px] md:w-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentToolIndex}
                    className="absolute left-0 w-full text-left text-xs sm:text-sm md:text-lg lg:text-xl cursor-pointer whitespace-nowrap overflow-hidden"
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
      </div>
    </section>
  );
};

export default GoldenParticleAbout;