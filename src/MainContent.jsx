import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import { Element } from "react-scroll";
import { useLocation } from "react-router-dom";
import MoonParticles from "./components/MoonParticles/MoonParticles";
import Navbar from "./components/Navbar/Navbar";
import AboutMe from "./pages/About/AboutMe";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact"; // Import the Contact component

export default function MainContent() {
  const location = useLocation();

  return (
    <div className="w-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      {/* Show main sections only when NOT in /gallery */}
      {location.pathname !== "/gallery" && (
        <>
          <Element name="home" className="w-screen h-screen flex items-center justify-center">
            <Canvas className="w-full h-full" camera={{ position: [0, 0, 7], fov: 45 }} shadows>
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                <MoonParticles />
                <EffectComposer>
                  <Bloom intensity={1.2} luminanceThreshold={0.1} luminanceSmoothing={0.9} kernelSize={2} />
                </EffectComposer>
              </Suspense>
            </Canvas>
          </Element>

          <Element name="about" className="min-h-screen flex items-center justify-center bg-gray-900">
            <AboutMe />
          </Element>

          <Element name="projects" className="min-h-screen flex items-center justify-center bg-gray-800">
            <Projects />
          </Element>

          {/* Added Contact section */}
          <Element name="contact" className="min-h-screen flex items-center justify-center bg-black">
            <Contact />
          </Element>
        </>
      )}
    </div>
  );
}