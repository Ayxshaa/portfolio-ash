// Layout.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Outlet, useLocation } from "react-router-dom";
import MoonParticles from "./components/MoonParticles/MoonParticles";
import Navbar from "./components/Navbar/Navbar";

export default function Layout() {
  const location = useLocation();
  const isGalleryPage = location.pathname === "/gallery";

  return (
    <div className="w-screen overflow-x-hidden bg-black text-white">
      <Navbar />
      
      {/* Persistent Canvas with MoonParticles */}
      <div 
        className="fixed top-0 left-0 w-full h-full"
        style={{ 
          zIndex: 0, // Keep consistent zIndex
          opacity: isGalleryPage ? 0.5 : 1, // Adjust opacity for gallery page
          pointerEvents: "none" // Prevent canvas from blocking interactions
        }}
      >
        <Canvas className="w-full h-full" camera={{ position: [0, 0, 7], fov: 45 }} shadows>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <MoonParticles />
            <EffectComposer>
              <Bloom 
                intensity={1.2} 
                luminanceThreshold={0.1} 
                luminanceSmoothing={0.9} 
                kernelSize={2} 
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      
      {/* Route content */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}