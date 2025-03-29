import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Portfolio Website",
      description: "A responsive portfolio website built with React and Tailwind CSS.",
      image: "./Gallery/project1.jpg",
      technologies: ["React", "Tailwind CSS", "JavaScript"],
      link: "https://example.com/project1",
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description: "A full-featured online store with user authentication and payment processing.",
      image: "./Gallery/project2.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "https://example.com/project2",
    },
    {
      id: 3,
      title: "Social Media Dashboard",
      description: "Analytics dashboard for monitoring social media performance across platforms.",
      image: "./Gallery/project3.jpg",
      technologies: ["React", "Chart.js", "Firebase", "API Integration"],
      link: "https://example.com/project3",
    },
    {
      id: 4,
      title: "Mobile App",
      description: "Cross-platform mobile application for event management and ticketing.",
      image: "./Gallery/project4.jpg",
      technologies: ["React Native", "Redux", "Firebase", "Expo"],
      link: "https://example.com/project4",
    },
  ];

  return (
    <section id="projects" className="relative w-full min-h-screen bg-black">
      <div className="text-center py-16">
        <h2 className="text-4xl font-[JazzFont] tracking-widest text-white">
          PROJECTS
        </h2>
        <div className="w-24 h-1 bg-purple-500 mx-auto mt-4"></div>
      </div>

      {/* Projects List */}
      <div className="relative w-full flex flex-col items-center">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }) => {
  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({ opacity: 1, y: 0, scale: 1, rotateX: 0 });
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      className="w-full max-w-4xl px-4 sm:px-6 mb-20"
      initial={{ opacity: 0, y: 80, scale: 0.8, rotateX: -10 }}
      animate={controls}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.2, // Delays each card slightly for a stagger effect
      }}
    >
      <motion.div
        whileHover={{
          scale: 1.05,
          rotateX: 5,
          boxShadow: "0px 10px 30px rgba(128,0,128,0.6)",
        }}
        className="bg-gray-900 bg-opacity-70 backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl transition-transform"
      >
        <div className="md:flex">
          <motion.div
            className="md:w-1/2"
            whileHover={{ scale: 1.08, rotateZ: 3 }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transform transition-transform duration-500"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x400?text=Project+Image";
              }}
            />
          </motion.div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <motion.h3
              className="text-2xl md:text-3xl font-[JazzFont] tracking-wider text-purple-400 mb-4"
              whileHover={{ scale: 1.1, color: "#fff" }}
            >
              {project.title}
            </motion.h3>
            <p className="text-gray-300 mb-6">{project.description}</p>
            <motion.div className="mb-6">
              <h4 className="text-sm font-bold text-gray-400 mb-2">
                TECHNOLOGIES:
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <motion.span
                    key={i}
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
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors duration-300 rounded-md font-[JazzFont] tracking-wider"
              whileHover={{ scale: 1.1 }}
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
