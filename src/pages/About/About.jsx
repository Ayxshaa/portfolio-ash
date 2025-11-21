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
        threshold: 0.3,
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
      constructor(delay = 0, streamIndex = 0, layerType = 'middle') {
        this.delay = delay;
        this.age = -delay;
        this.lifetime = 6000;
        this.streamIndex = streamIndex;
        this.layerType = layerType;
        
        // Size based on layer (matching moon particle system)
        switch (layerType) {
          case 'core':
            this.baseSize = 0.8 + Math.random() * 1.2; // Larger core particles
            break;
          case 'middle':
            this.baseSize = 0.5 + Math.random() * 0.8;
            break;
          case 'outer':
            this.baseSize = 0.3 + Math.random() * 0.5; // Smaller outer particles
            break;
        }
        this.size = this.baseSize;
        
        // Color based on layer (warmer core, cooler outer)
        let warmth, redShift;
        switch (layerType) {
          case 'core':
            warmth = 0.9 + Math.random() * 0.1;
            redShift = 0.1 + Math.random() * 0.3;
            this.r = warmth;
            this.g = warmth * (0.7 + Math.random() * 0.2);
            this.b = warmth * 0.5;
            break;
          case 'middle':
            warmth = 0.75 + Math.random() * 0.25;
            this.r = warmth;
            this.g = warmth * (0.8 + Math.random() * 0.2);
            this.b = warmth * (0.5 + Math.random() * 0.3);
            break;
          case 'outer':
            warmth = 0.7 + Math.random() * 0.3;
            this.r = warmth;
            this.g = warmth * (0.9 + Math.random() * 0.1);
            this.b = warmth * (0.7 + Math.random() * 0.2);
            break;
        }
        
        this.shimmerPhase = Math.random() * Math.PI * 2;
        this.shimmerSpeed = 0.015 + Math.random() * 0.025;
        
        this.depth = Math.random();
        
        // Wave properties based on layer - TIGHTER STREAMS
        const baseAmplitude = layerType === 'core' ? 18 : (layerType === 'middle' ? 25 : 35);
        this.waveAmplitude = baseAmplitude + Math.random() * 10;
        this.flowOffset = (streamIndex / 6) * Math.PI * 2;
      }
      
      getPosition(canvas) {
        const progress = this.age / this.lifetime;
        
        if (progress < 0) return null;
        if (progress > 1) return null;
        
        const w = canvas.width;
        const h = canvas.height;
        
        const easedProgress = this.easeInOutQuart(progress);
        
        const startX = w * 0.05;
        const startY = h * 0.05;
        const endX = w * 0.95;
        const endY = h * 0.95;
        
        const baseX = startX + (endX - startX) * easedProgress;
        const baseY = startY + (endY - startY) * easedProgress;
        
        const diagonalAngle = Math.atan2(endY - startY, endX - startX);
        const perpAngle = diagonalAngle + Math.PI / 2;
        
        // Perfect sine wave with multiple cycles
        const wavePhase = easedProgress * Math.PI * 9 + this.flowOffset;
        const waveAmplitude = this.waveAmplitude * (1 - easedProgress * 0.15);
        const waveOffset = Math.sin(wavePhase) * waveAmplitude;
        
        let x = baseX + Math.cos(perpAngle) * waveOffset;
        let y = baseY + Math.sin(perpAngle) * waveOffset;
        
        // Organic variation
        const microPhase = progress * Math.PI * 12 + this.shimmerPhase;
        x += Math.sin(microPhase) * 2;
        y += Math.cos(microPhase * 0.8) * 2;
        
        // Opacity with layer-specific brightness - INCREASED
        let baseOpacity;
        switch (this.layerType) {
          case 'core':
            baseOpacity = 1.0;
            break;
          case 'middle':
            baseOpacity = 0.95;
            break;
          case 'outer':
            baseOpacity = 0.85;
            break;
        }
        
        let opacity;
        if (progress < 0.1) {
          opacity = this.easeOutCubic(progress / 0.1) * baseOpacity;
        } else if (progress > 0.9) {
          opacity = this.easeInCubic((1 - progress) / 0.1) * baseOpacity;
        } else {
          opacity = baseOpacity * (0.9 + Math.sin(progress * Math.PI * 3) * 0.1);
        }
        
        const sizePulse = 0.9 + Math.sin(progress * Math.PI * 5 + this.shimmerPhase) * 0.1;
        const size = this.baseSize * sizePulse;
        
        return { x, y, opacity, size, progress };
      }
      
      easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
      }
      
      easeInCubic(t) {
        return t * t * t;
      }
      
      easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }
      
      update(deltaTime) {
        this.age += deltaTime;
        this.shimmerPhase += this.shimmerSpeed * deltaTime;
      }
      
      draw(ctx, canvas, time) {
        const pos = this.getPosition(canvas);
        if (!pos) return false;
        
        const { x, y, opacity, size } = pos;
        
        // Shimmer effect
        const shimmer = 0.92 + Math.sin(this.shimmerPhase + time * 0.008) * 0.08;
        const shimmerR = Math.min(1.0, this.r * shimmer);
        const shimmerG = Math.min(1.0, this.g * shimmer);
        const shimmerB = Math.min(1.0, this.b * shimmer);
        
        // Depth-based glow (matching moon particle shader)
        const depthFactor = 0.4 + this.depth * 0.6;
        
        // Outer glow (soft halo)
        const glowRadius = size * 4.5;
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        
        glowGradient.addColorStop(0, `rgba(${Math.floor(shimmerR * 255)}, ${Math.floor(shimmerG * 255)}, ${Math.floor(shimmerB * 255)}, ${opacity * depthFactor * 0.8})`);
        glowGradient.addColorStop(0.3, `rgba(${Math.floor(shimmerR * 255 * 0.9)}, ${Math.floor(shimmerG * 255 * 0.9)}, ${Math.floor(shimmerB * 255 * 0.9)}, ${opacity * depthFactor * 0.4})`);
        glowGradient.addColorStop(0.6, `rgba(${Math.floor(shimmerR * 255 * 0.7)}, ${Math.floor(shimmerG * 255 * 0.7)}, ${Math.floor(shimmerB * 255 * 0.7)}, ${opacity * depthFactor * 0.2})`);
        glowGradient.addColorStop(1, `rgba(${Math.floor(shimmerR * 255)}, ${Math.floor(shimmerG * 255)}, ${Math.floor(shimmerB * 255)}, 0)`);
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright core with enhanced center intensity
        const coreRadius = size * 1.5;
        const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, coreRadius);
        
        const centerIntensity = 1.4 + (1 - this.depth * 0.3);
        const whiteIntensity = 0.96 + Math.sin(this.shimmerPhase * 2) * 0.04;
        
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * whiteIntensity * depthFactor})`);
        coreGradient.addColorStop(0.4, `rgba(${Math.floor(shimmerR * 255 * centerIntensity)}, ${Math.floor(shimmerG * 255 * centerIntensity)}, ${Math.floor(shimmerB * 255 * centerIntensity)}, ${opacity * depthFactor * 0.9})`);
        coreGradient.addColorStop(0.7, `rgba(${Math.floor(shimmerR * 255)}, ${Math.floor(shimmerG * 255)}, ${Math.floor(shimmerB * 255)}, ${opacity * depthFactor * 0.6})`);
        coreGradient.addColorStop(1, `rgba(${Math.floor(shimmerR * 255)}, ${Math.floor(shimmerG * 255)}, ${Math.floor(shimmerB * 255)}, ${opacity * depthFactor * 0.2})`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      }
    }

    // Create dense layered particle streams - MORE STREAMS, DENSER
    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      
      const streams = 6; // Reduced to 6 lines
      const particlesPerStream = 650; // Increased density per stream
      const totalDuration = 5500;
      
      const layerTypes = ['core', 'middle', 'outer'];
      const layerDistribution = [0.35, 0.5, 0.15]; // More core particles
      
      for (let stream = 0; stream < streams; stream++) {
        const streamDelay = (stream / streams) * 600; // Closer timing
        
        for (let i = 0; i < particlesPerStream; i++) {
          const particleDelay = streamDelay + (i / particlesPerStream) * totalDuration;
          
          // Determine layer type based on distribution
          const rand = Math.random();
          let layerType;
          if (rand < layerDistribution[0]) {
            layerType = 'core';
          } else if (rand < layerDistribution[0] + layerDistribution[1]) {
            layerType = 'middle';
          } else {
            layerType = 'outer';
          }
          
          particlesRef.current.push(new Particle(particleDelay, stream, layerType));
        }
      }
      
      console.log(`Created ${particlesRef.current.length} particles across ${streams} streams`);
    }

    let lastTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current = currentTime;

      // Subtle additive blending effect - slightly less fade for more visible trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.012)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sort by depth for proper layering (back to front)
      particlesRef.current.sort((a, b) => a.depth - b.depth);
      
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update(deltaTime);
        return particle.draw(ctx, canvas, currentTime);
      });

      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
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