import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Projects = () => {
  const containerRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: "CHAT APPLICATION",
      description: "01",
      image: "https://media.istockphoto.com/id/1834968051/photo/chatbot-engaging-in-online-conversations.webp?s=1024x1024&w=is&k=20&c=WciIMg--LWPaKJRMFlOeH4cpN3AWLRWpPLXao2AEfAQ="
    },
    {
      id: 2,
      title: "EVENT MANAGEMENT",
      description: "02",
      image: "https://images.unsplash.com/photo-1597879995289-a5ef25133718?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 3,
      title: "EMPLOYEE MANAGEMENT",
      description: "03",
      image: "https://plus.unsplash.com/premium_photo-1676320103037-fae0b1d3668d?q=80&w=3104&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section className="relative min-h-screen bg-black bg-opacity-90 backdrop-blur-md" id="projects">
      <div ref={containerRef} className="h-[500vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          {projects.map((project, index) => {
            const start = index === 0 ? 0 : index * 0.4;
            const end = (index + 1) * 0.45;

            const opacity = useTransform(
              scrollYProgress,
              [start - 0.05, start, end - 0.15, end],
              [0, 1, 1, 0]
            );

            const scale = useTransform(scrollYProgress, [start, end], [1.1, 1]);

            return (
              <motion.div
                key={project.id}
                className="absolute w-[60vw] h-[60vh] text-white font-[JazzFont]"
                style={{
                  opacity,
                  scale,
                  zIndex: projects.length - index,
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg border border-purple-500 shadow-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <motion.div
                    className="absolute bottom-12 left-12 text-white text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="mb-3 text-7xl tracking-wide bg-black/50 px-4 py-2 rounded-md border border-white">
                      {project.description}
                    </p>
                    <h3 className="text-3xl tracking-wide bg-black/50 px-4 py-2 rounded-md border border-white">
                      {project.title}
                    </h3>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
