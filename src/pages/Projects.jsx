import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const sectionRef = useRef(null);
  
  const projects = [
    {
      id: 1,
      title: "Portfolio Website",
      description: "A responsive portfolio website built with React and Tailwind CSS.",
      image: "./Gallery/Project1.png",
      technologies: ["React", "Tailwind CSS", "JavaScript"],
      link: "https://ayeshashhh.netlify.app/",
    },
    {
      id: 2,
      title: "Chat-Application:A4 Zone",
      description: "Real-time chat application with user authentication and payment integration.",
      image: "./Gallery/ChatApplication.png",
      technologies: ["React", "tawilwind", "MongoDB", "JAVA", "AI integration"],
      link: "https://a4zone.onrender.com/",
    },
    {
      id: 3,
      title: "Event Management ",
      description: "A web application for managing events, including ticket booking and user registration.",
      image: "./Gallery/EventManagement.png",
      technologies: ["React", "MongoDB", "Express", "Node.js"],
      link: "https://flowevent.netlify.app/",
    },
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
      className="relative w-full min-h-screen bg-black"
    >
      <motion.div 
        className="text-center py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headerVariants}
      >
        <h2 className="text-4xl font-[JazzFont] tracking-widest text-white">
          PROJECTS
        </h2>
        <motion.div 
          className="w-24 h-1 bg-purple-500 mx-auto mt-4"
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        ></motion.div>
      </motion.div>

      {/* Projects List */}
      <div className="relative w-full flex flex-col items-center">
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
    </section>
  );
};

const ProjectCard = ({ project, index, isActive, setActiveProject }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // More dramatic entry animation per card
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
          setActiveProject(index);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [controls, setActiveProject, index]);

  // Card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 100, 
      scale: 0.9, 
      rotateX: -15,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier easing for more natural motion
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  // Tech tags animation
  const tagVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }
    })
  };

  return (
    <motion.div
      ref={ref}
      className="w-full max-w-4xl px-4 sm:px-6 mb-20"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={cardVariants}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        whileHover={{
          scale: 1.03,
          rotateX: 3,
          boxShadow: "0px 10px 30px rgba(128,0,115,0.3)", 
        }}
        className={`bg-gray-900 bg-opacity-20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${
          isActive ? "border border-purple-500 shadow-purple-900/20" : ""
        }`}
      >
        <div className="md:flex">
          <motion.div
            className="md:w-1/2"
            variants={contentVariants}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-[calc(100%-1rem)] h-[calc(100%-1rem)] rounded-xl pt-3.5 pl-3.5 object-cover"
              initial={{ filter: "blur(5px)", scale: 1.1 }}
              animate={{ filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x400?text=Project+Image";
              }}
            />
          </motion.div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <motion.h3
              variants={contentVariants}
              className="text-2xl md:text-3xl font-[JazzFont] tracking-wider text-gray-400 mb-4"
            >
              {project.title}
            </motion.h3>
            <motion.p 
              variants={contentVariants}
              className="text-gray-200 mb-6"
            >
              {project.description}
            </motion.p>
            <motion.div 
              variants={contentVariants}
              className="mb-6"
            >
              <h4 className="text-sm font-bold text-gray-400 mb-2">
                TECHNOLOGIES:
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={tagVariants}
                    className="px-3 py-1 bg-purple-900 bg-opacity-60 rounded-full text-xs text-white"
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: "#fff",
                      color: "#6B46C1",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
            <motion.a
              variants={contentVariants}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 border border-gray-500 text-gray-400 hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-colors duration-300 rounded-md font-[JazzFont] tracking-wider"
              whileHover={{ 
                scale: 1.1,
                transition: { type: "spring", stiffness: 400 }
              }}
            >
              VIEW PROJECT
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Projects;