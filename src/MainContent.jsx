import React, { lazy, Suspense } from "react";
import { Element } from "react-scroll";

// Replace direct imports with lazy loading
const AboutMe = lazy(() => import("./pages/About/AboutMe"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

export default function MainContent() {
  return (
    <div className="w-screen overflow-x-hidden">
      <Element name="home" className="w-screen h-screen flex items-center justify-center">
        {/* The Canvas is now in Layout, don't include it here */}
      </Element>

      <Element name="about" className="min-h-screen flex items-center justify-center bg-gray-900">
        <Suspense fallback={<div className="text-white text-xl flex items-center justify-center">Loading about section...</div>}>
          <AboutMe />
        </Suspense>
      </Element>

      <Element name="projects" className="min-h-screen flex items-center justify-center bg-gray-800">
        <Suspense fallback={<div className="text-white text-xl flex items-center justify-center">Loading projects...</div>}>
          <Projects />
        </Suspense>
      </Element>

      <Element name="contact" className="min-h-screen flex items-center justify-center bg-black">
        <Suspense fallback={<div className="text-white text-xl flex items-center justify-center">Loading contact info...</div>}>
          <Contact />
        </Suspense>
      </Element>
    </div>
  );
}