import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const sectionRef = useRef(null);
  
  const projects = [
    {
      id: 1,
      title: "Portfolio Website",
      description: "A responsive portfolio website built with React and Tailwind CSS.",
      image: "./Gallery/ProjectMoon.png",
      technologies: ["React", "Tailwind CSS", "JavaScript"],
      link: "https://ayeshashhh.netlify.app/",
      github: "https://github.com/Ayxshaa/portfolio-ash",
    },
    {
      id: 2,
      title: "Chat-Application:A4 Zone",
      description: "Real-time chat application with user authentication and payment integration.",
      image: "./Gallery/ChatApp2.png",
      technologies: ["React", "tawilwind", "MongoDB", "JAVA", "AI integration"],
      link: "https://a4zone.onrender.com/",
      github: "https://github.com/Ayxshaa/chat-app",
    },
    {
      id: 3,
      title: "Event Management ",
      description: "A web application for managing events, including ticket booking and user registration.",
      image: "./Gallery/EventManagement2.png",
      technologies: ["React", "MongoDB", "Express", "Node.js"],
      link: "https://flowevent.netlify.app/",
      github: "https://github.com/Ayxshaa/EDC-LandingPage",
    },
    {
      id: 4,
      title:"3d Gallery",
      description: "A 3D gallery showcasing various artworks using Three.js.",
      image: "./Gallery/3d-Image.png",
      technologies: ["Three.js", "React", "CSS"],
      link: "https://ayxshaa.github.io/VideoGallery/",
      github: "https://github.com/Ayxshaa/VideoGallery",
    }
  ];

  // Scroll to projects section when navigating from navbar
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#projects' && sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        
        // Add a nice reveal animation when directly navigated to
        setTimeout(() => {
          projects.forEach((_, index) => {
            setTimeout(() => setActiveProject(index), index * 400);
          });
        }, 300);
      }
    };

    // Execute on mount in case the URL already has the hash
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Header animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="relative w-full min-h-screen bg-black bg-[radial-gradient(circle_at_bottom,rgba(88,28,135,0.35),transparent_70%)]"
    >
      <motion.div 
        className="text-center py-12 md:py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headerVariants}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-[JazzFont] tracking-widest text-white">
          PROJECTS
        </h2>
      </motion.div>

      {/* Projects List */}
      <div className="relative w-full px-4 sm:px-6 pb-12 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              isActive={activeProject === index}
              setActiveProject={setActiveProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, isActive, setActiveProject }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Scroll-based reveal animation
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Animate in
          setIsVisible(true);
          setHasAnimated(true);
          element.style.transform = 'translate(0, 0)';
          element.style.opacity = '1';
          element.style.visibility = 'visible';
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0 && hasAnimated) {
          // Scrolled past - hide element (onLeave)
          setIsVisible(false);
          element.style.opacity = '0';
          element.style.visibility = 'hidden';
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    // Set initial state based on index (left, right alternating)
    const direction = index % 2; // 0 = left, 1 = right
    let xOffset = 0;
    let yOffset = 100;
    
    if (direction === 0) {
      xOffset = -100;
      yOffset = 0;
    } else if (direction === 1) {
      xOffset = 100;
      yOffset = 0;
    }
    
    element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    element.style.transition = 'transform 1.25s cubic-bezier(0.19, 1, 0.22, 1), opacity 1.25s cubic-bezier(0.19, 1, 0.22, 1), visibility 0s linear 0s';

    observer.observe(element);
    
    return () => observer.disconnect();
  }, [index, hasAnimated]);

  // Watch for re-entry after initial animation
  useEffect(() => {
    if (!hasAnimated) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Re-entering viewport
          setIsVisible(true);
          element.style.visibility = 'visible';
          element.style.transform = 'translate(0, 0)';
          element.style.opacity = '1';
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
          // Scrolled past (onLeave)
          setIsVisible(false);
          element.style.opacity = '0';
          element.style.visibility = 'hidden';
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={ref}
      className="w-full h-full"
    >
      <div
        className="h-full bg-gradient-to-br from-purple-900/20 via-gray-900/40
         to-black/60 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border 
         transition-all duration-500 border-purple-900/30 
         hover:scale-105 hover:-translate-y-2 
         hover:shadow-[0px_20px_50px_rgba(112,73,149,0.4)]"
      >
        <div className="flex flex-col h-full">
            <div
              className="w-full h-40 sm:h-48 md:h-56 relative overflow-hidden"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-[calc(100%-0.5rem)] sm:w-[calc(100%-1rem)] h-full rounded-md sm:rounded-xl mt-1 sm:mt-2 ml-1 sm:ml-2 object-center bg-gray-900/50"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x400?text=Project+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          </div>
          
            <div className="w-full p-4 sm:p-6 flex flex-col justify-between flex-grow">
              <div>
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-[JazzFont] tracking-wider text-purple-200 mb-2 sm:mb-3"
                >
                  {project.title}
                </h3>
                <p 
                  className="text-gray-300 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed"
              >
                {project.description}
              </p>
              <div 
                className="mb-5"
              >
                <h4 className="text-xs font-bold text-purple-500 mb-2 tracking-wider">
                  TECHNOLOGIES
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#704995] border border-purple-500/50 rounded-full text-xs text-gray-200 font-medium hover:scale-110 hover:bg-purple-600/60 hover:border-purple-500/80 hover:text-white transition-all duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
              <div className="flex gap-2 sm:gap-3 items-center">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 sm:p-2.5 border-2 border-purple-500/60 bg-purple-600/10 text-purple-300 hover:bg-[#704995] hover:border-purple-500 hover:text-white transition-all duration-300 rounded-lg hover:scale-110"
                  title="View Project"
                >
                  <ArrowRight size={18} />
                </a>
                <a
                  href={`https://github.com/${project.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 sm:p-2.5 border-2 border-purple-500/60 bg-purple-600/10 text-purple-300 hover:bg-[#704995] hover:border-purple-500 hover:text-white transition-all duration-300 rounded-lg hover:scale-110"
                  title="GitHub Repository"
                >
                  <Github size={18} />
                </a>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;