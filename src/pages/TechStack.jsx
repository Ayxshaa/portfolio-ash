import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TechStack = () => {
  // State management
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Refs for smooth animation
  const containerRef = useRef(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastMouseYRef = useRef(0);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);

  // Configuration
  const RADIUS = 280; // circle radius in pixels (larger ring)
  const CENTER_X = 20; // pixels from right edge (shifted left)
  const CENTER_Y = 50; // percentage from top
  const AUTO_ROTATION = 0.08; // degrees per frame (slower, smoother rotation)
  const DAMPING = 0.97; // velocity damping/inertia (higher = more smooth)
  const MOUSE_SENSITIVITY = 0.3; // mouse movement sensitivity
  const INTERACTION_RADIUS = 350; // pixels - only respond to mouse near circle
  const DRAG_ACTIVATION_RADIUS = 320; // pixels - must be very close to ring to start drag (tighter than hover)

  // Tech stack data
  const techStack = [
    { name: 'React', icon: '/icons/react.svg', brandColor: '#61dafb' },
    { name: 'Node.js', icon: '/icons/nodejs.svg', brandColor: '#68a063' },
    { name: 'TypeScript', icon: '/icons/typescript.svg', brandColor: '#3178c6' },
    { name: 'JavaScript', icon: '/icons/javascript.svg', brandColor: '#f7df1e' },
    { name: 'Vite', icon: '/icons/vitejs.svg', brandColor: '#646cff' },
    { name: 'Tailwind', icon: '/icons/tailwind.svg', brandColor: '#06b6d4' },
    { name: 'Framer Motion', icon: '/icons/framer-motion.svg', brandColor: '#0055ff' },
    { name: 'Three.js', icon: '/icons/threejs.svg', brandColor: '#ffffff' },
    {name: "GSAP", icon: "/icons/gsap.svg", brandColor: "#88ce02"},
  ];

  // Handle mouse movement for momentum - only near circle
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const currentY = e.clientY;
    
    // If dragging, always apply movement
    if (isDraggingRef.current) {
      const deltaY = currentY - lastMouseYRef.current;
      velocityRef.current = deltaY * 0.35; // Reduced for smoother drag
      lastMouseYRef.current = currentY;
      return;
    }

    // For hover interaction
    const rect = containerRef.current.getBoundingClientRect();
    const circleX = rect.right + CENTER_X;
    const circleY = rect.top + (rect.height * CENTER_Y / 100);
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate distance from mouse to circle center
    const dx = mouseX - circleX;
    const dy = mouseY - circleY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only apply interaction if near the circle
    if (distance < INTERACTION_RADIUS) {
      const deltaY = currentY - lastMouseYRef.current;
      
      // Calculate influence based on proximity (closer = stronger)
      const influence = 1 - (distance / INTERACTION_RADIUS);
      
      // Add mouse velocity to rotation with sensitivity and proximity influence
      velocityRef.current = deltaY * MOUSE_SENSITIVITY * influence * 0.08;
      lastMouseYRef.current = currentY;
    }
  };

  // Handle mouse down for drag
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const circleX = rect.right + CENTER_X;
    const circleY = rect.top + (rect.height * CENTER_Y / 100);
    
    const dx = e.clientX - circleX;
    const dy = e.clientY - circleY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check if mouse is within ring area (between inner and outer radius)
    const innerRadius = RADIUS - 100; // Inner boundary
    const outerRadius = RADIUS + 100; // Outer boundary
    
    if (distance >= innerRadius && distance <= outerRadius) {
      isDraggingRef.current = true;
      lastMouseYRef.current = e.clientY;
      velocityRef.current = 0; // Reset velocity when starting drag
      document.body.style.cursor = 'grabbing';
      setHasInteracted(true);
      setShowHint(false);
      e.preventDefault();
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
    }
  };

  // Handle wheel scroll
  const handleWheel = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const circleX = rect.right + CENTER_X;
    const circleY = rect.top + (rect.height * CENTER_Y / 100);
    
    const dx = e.clientX - circleX;
    const dy = e.clientY - circleY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < INTERACTION_RADIUS) {
      e.preventDefault();
      // Reduced scroll sensitivity for smoother experience
      velocityRef.current += e.deltaY * 0.03;
      setHasInteracted(true);
      setShowHint(false);
    }
  };

  // Calculate logo position on arc
  const getLogoPosition = (index, currentRotation) => {
    const itemCount = techStack.length;
    const anglePerItem = 360 / itemCount;
    const angle = (index * anglePerItem + currentRotation) * (Math.PI / 180);
    
    // Calculate position relative to center
    const x = Math.cos(angle) * RADIUS;
    const y = Math.sin(angle) * RADIUS;
    
    return { x, y, angle: angle * (180 / Math.PI) };
  };

  // Determine active logo (at center/left of screen)
  const getActiveIndex = (currentRotation) => {
    const itemCount = techStack.length;
    const anglePerItem = 360 / itemCount;
    
    // Target angle is 180 (left/center of circular path)
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const targetAngle = 180;
    
    let closestIndex = 0;
    let minDiff = Infinity;
    
    for (let i = 0; i < itemCount; i++) {
      const itemAngle = (i * anglePerItem + normalizedRotation) % 360;
      const diff = Math.min(
        Math.abs(itemAngle - targetAngle),
        Math.abs(itemAngle - targetAngle + 360),
        Math.abs(itemAngle - targetAngle - 360)
      );
      
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  };

  // Animation loop with mouse momentum
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastTimeRef.current) / 16.67, 1.5);
      lastTimeRef.current = now;

      // Combine auto-rotation with mouse velocity (momentum)
      rotationRef.current += AUTO_ROTATION * deltaTime + velocityRef.current;

      // Apply damping to velocity (smooth deceleration)
      velocityRef.current *= DAMPING;

      // Update state
      setRotation(rotationRef.current);
      setActiveIndex(getActiveIndex(rotationRef.current));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen flex items-center justify-end bg-black overflow-hidden"
    >
      <div className="relative w-full h-full">
        {/* SVG Arc Path - Right half only */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.35 }}
        >
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.6" />
              <stop offset="50%" stopColor="rgb(168, 85, 247)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Circle embedded in layout - more visible */}
          <circle
            cx={`calc(100% + ${CENTER_X}px)`}
            cy={`${CENTER_Y}%`}
            r={RADIUS}
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="2"
          />
        </svg>

        {/* Logos Container */}
        <div 
          className="absolute inset-0"
          style={{ perspective: '1200px' }}
        >
          {techStack.map((tech, index) => {
            const { x, y, angle } = getLogoPosition(index, rotation);
            const isActive = index === activeIndex;
            
            // Convert to screen coordinates
            const screenX = `calc(100% + ${CENTER_X + x}px)`;
            const screenY = `calc(${CENTER_Y}% + ${y}px)`;
            
            // Counter-rotate to keep logos upright
            const counterRotation = -rotation - (index * 360 / techStack.length);

            return (
              <motion.div
                key={tech.name}
                className="absolute"
                style={{
                  left: screenX,
                  top: screenY,
                  x: '-50%',
                  y: '-50%',
                }}
                animate={{
                  scale: isActive ? 1.4 : 0.85,
                  opacity: isActive ? 1 : 0.55,
                }}
                transition={{
                  scale: { type: 'spring', stiffness: 180, damping: 18 },
                  opacity: { duration: 0.2, ease: 'easeOut' },
                }}
              >
                {/* Logo wrapper with counter-rotation */}
                <motion.div
                  className="relative"
                  style={{
                    rotate: counterRotation,
                  }}
                >
                  {/* Active glow effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{
                        background: tech.brandColor,
                        scale: 1.8,
                      }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Logo Container */}
                  <motion.div
                    className="relative w-20 h-20 flex items-center justify-center rounded-full border-2 backdrop-blur-md cursor-pointer"
                    style={{
                      borderColor: isActive ? tech.brandColor : 'rgba(168, 85, 247, 0.3)',
                      backgroundColor: isActive 
                        ? `${tech.brandColor}20`
                        : 'rgba(30, 20, 40, 0.5)',
                      boxShadow: isActive
                        ? `0 0 30px ${tech.brandColor}80, inset 0 0 20px ${tech.brandColor}40`
                        : '0 2px 8px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {/* Icon with dynamic filter */}
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-10 h-10 object-contain transition-all duration-300"
                      style={{
                        filter: isActive
                          ? `drop-shadow(0 0 10px ${tech.brandColor}) saturate(1.6) brightness(1.2)`
                          : 'grayscale(100%) brightness(0.6) opacity(0.7)',
                        transform: (tech.name === 'Framer Motion' || tech.name === 'Three.js') ? 'rotate(90deg)' : (tech.name === 'Vite' || tech.name === 'TypeScript' || tech.name === 'JavaScript' || tech.name === 'GSAP') ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Center Reference Point */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-purple-400"
          style={{
            left: `calc(100% + ${CENTER_X}px)`,
            top: `${CENTER_Y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            boxShadow: ['0 0 15px rgba(168, 85, 247, 0.6)', '0 0 30px rgba(168, 85, 247, 0.9)', '0 0 15px rgba(168, 85, 247, 0.6)'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
          }}
        />

        {/* Interactive Hint - Modern Floating UI */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute"
            style={{
              left: `calc(100% + ${CENTER_X}px)`,
              top: `calc(${CENTER_Y}% + ${RADIUS + 120}px)`,
              transform: 'translateX(-50%)',
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glassmorphic card */}
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/30 rounded-2xl px-6 py-4 shadow-2xl">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl -z-10" />
                
                <div className="flex items-center gap-4">
                  {/* Animated mouse icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative w-8 h-12 border-2 border-purple-400 rounded-full flex items-start justify-center pt-2"
                  >
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1 h-3 bg-purple-400 rounded-full"
                    />
                  </motion.div>

                  {/* Text */}
                  <div className="flex flex-col gap-1">
                    <span className="text-purple-300 font-semibold text-sm tracking-wide">
                      SCROLL OR DRAG
                    </span>
                    <span className="text-purple-400/70 text-xs">
                      Move the ring to see the stack
                    </span>
                  </div>

                  {/* Sparkle effect */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 180, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-purple-400 text-xl"
                  >
                    ✨
                  </motion.div>
                </div>

                {/* Animated arrow pointing up */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-400">
                    <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Tech Name Display - Left Side Center */}
        <motion.div
          className="absolute left-1/4 top-1/2 -translate-y-1/2 font-[JazzFont]"
          key={activeIndex}
        >
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20 
            }}
            className="relative"
          >
            {/* Glow background */}
            {/* <motion.div
              className="absolute inset-0 blur-3xl rounded-full"
              style={{
                background: techStack[activeIndex].brandColor,
                opacity: 0.3,
                scale: 1.5,
              }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1.3, 1.6, 1.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            /> */}

            {/* Main text container */}
            <div className="relative backdrop-blur-xl rounded-3xl px-6 py-6 shadow-2xl"
              style={{
                borderColor: techStack[activeIndex].brandColor,
                // boxShadow: `0 0 40px ${techStack[activeIndex].brandColor}40`,
              }}
            >
              {/* Tech name */}
              <motion.h2
                className="text-2xl font-bold tracking-tight"
                style={{
                  color: techStack[activeIndex].brandColor,
                  textShadow: `0 0 20px ${techStack[activeIndex].brandColor}80`,
                }}
                animate={{
                  textShadow: [
                    `0 0 20px ${techStack[activeIndex].brandColor}80`,
                    `0 0 35px ${techStack[activeIndex].brandColor}`,
                    `0 0 20px ${techStack[activeIndex].brandColor}80`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {techStack[activeIndex].name}
              </motion.h2>

              {/* Accent line */}
              <motion.div
                className="h-0.5 rounded-full mt-3"
                style={{
                  background: `linear-gradient(90deg, ${techStack[activeIndex].brandColor}, transparent)`,
                }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            {/* Particle effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: techStack[activeIndex].brandColor,
                  top: `${20 + i * 30}%`,
                  left: `${-10 - i * 15}px`,
                }}
                animate={{
                  x: [-20, 20],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TechStack;