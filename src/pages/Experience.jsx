import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useRef } from 'react'
import Button from '../components/UI/Button';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const containerRef = useRef();
  const headingRef = useRef();
  const contentRef = useRef();
  const imageWrapperRef = useRef();
  const techButtonsRef = useRef([]);

  const handleImageHover = (e) => {
    const wrapper = imageWrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate position relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation angles based on cursor position
    // rotateX: tilts up/down (controlled by Y position)
    // rotateY: tilts left/right (controlled by X position)
    const rotateX = ((y - centerY) / centerY) * -15; // Max 15 degrees
    const rotateY = ((x - centerX) / centerX) * 15;  // Max 15 degrees
    
    // Slight scale increase for depth effect
    gsap.to(imageWrapperRef.current, {
      rotationX: rotateX,
      rotationY: rotateY,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleImageHoverEnd = () => {
    gsap.to(imageWrapperRef.current, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  useGSAP(() => {
    // Heading animation - fade in and slide up
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Content animation - slide in from right
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Stagger animation for tech buttons
    gsap.fromTo(
      techButtonsRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.5,
        ease: "back.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { scope: containerRef });

  const technologies = ['JavaScript', 'React.js', 'CSS', 'HTML', 'GSAP'];

  return (
    <div 
      ref={containerRef}
      className='experience font-[JazzFont] bg-black min-h-screen py-20 flex flex-col justify-center items-center'
    >
      {/* Heading - centered and aligned properly */}
      <div className='w-full flex justify-center items-center mb-12'>
        <h1 
          ref={headingRef}
          className='text-5xl md:text-6xl font-light text-center text-white'
        >
          Experience
        </h1>
      </div>

      {/* Content Container */}
      <div className='w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row pt-12 gap-12 lg:gap-20 justify-center items-center'>
        
        {/* Image Section with 3D Tilt Hover Effect */}
        <div 
          className="experienceImage h-80 w-full lg:w-2/5 rounded-2xl"
          style={{
            perspective: "1200px",
            cursor: "pointer"
          }}
          onMouseMove={handleImageHover}
          onMouseLeave={handleImageHoverEnd}
        >
          <div
            ref={imageWrapperRef}
            className="h-full w-full rounded-2xl overflow-hidden shadow-lg"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              transition: "box-shadow 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(139, 92, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
            }}
          >
            <img 
              className="h-full w-full object-cover" 
              src="./Bg.png" 
              alt="Experience illustration" 
            />
          </div>
        </div>

        {/* Text Content Section */}
        <div 
          ref={contentRef}
          className="experienceText w-full lg:w-3/5 flex flex-col justify-center items-center lg:items-start gap-6 text-white"
        >
          <h2 className='text-2xl lg:text-3xl font-bold text-center lg:text-left'>Wavelaps - Frontend Developer</h2>
          
          <h4 className='text-lg text-gray-300 text-center lg:text-left'>Sep 2025 - Present</h4>
          
          <p className='text-base lg:text-lg text-gray-400 leading-relaxed max-w-lg text-center lg:text-left'>
At Wavelaps, I worked on the development and enhancement of the main Wavelaps website and the XRCH Hackathon page.
 I used React.js to build reusable and scalable components and implemented smooth animations to create an engaging 
 and interactive user experience. I integrated NodeMailer for email functionality, enabling automated notifications
  and form submissions. Additionally, I worked with Cloudflare to ensure optimized performance, security, and
   reliable deployment of the website
          </p>

          {/* Technologies Section */}
          <div className="technologies w-full flex flex-wrap items-center justify-center lg:justify-start gap-3">
            {technologies.map((tech, index) => (
              <button
                key={tech}
                ref={(el) => (techButtonsRef.current[index] = el)}
                className='px-5 py-2 font-bold bg-[#704995] text-gray-200 rounded-full hover:bg-purple-600 transition-all duration-300 text-sm lg:text-base whitespace-nowrap'
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Experience