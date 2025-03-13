import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import MoonParticles from "./components/MoonParticles/MoonParticles";
import Navbar from "./components/Navbar/Navbar";
import AboutMe from "./pages/About/AboutMe"; // Import About Section

export default function App() {
  return (
    <div className="w-screen overflow-x-hidden bg-black text-white">
      {/* Navbar (Fixed) */}
      <Navbar />

      {/* Three.js Scene */}
      <section className="w-screen h-screen flex items-center justify-center">
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
      </section>

      {/* About Section (Scrollable) */}
      <section className="min-h-screen flex items-center justify-center bg-black">
        <AboutMe />
      </section>
    </div>
  );
}
