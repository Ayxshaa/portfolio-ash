// Layout.jsx
import React, { Suspense, lazy, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Outlet, useLocation } from "react-router-dom";

const Navbar = lazy(() => import("./components/Navbar/Navbar"));
const MoonParticles = lazy(() => import("./components/MoonParticles/MoonParticles"));

// Enhanced Loading Screen with custom fonts and styling
const MoonLoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative text-center z-10">
        {/* Animated Moon Icon */}
        <div className="mb-8 relative">
          {/* Main moon */}
          <div className="w-24 h-24 mx-auto relative">
            {/* Moon glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300/30 to-purple-600/30 blur-xl animate-pulse"></div>
            
            {/* Moon surface */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-500 shadow-2xl overflow-hidden">
              {/* Moon craters */}
              <div className="absolute top-3 left-4 w-4 h-4 bg-gray-600/40 rounded-full"></div>
              <div className="absolute bottom-4 right-5 w-3 h-3 bg-gray-600/30 rounded-full"></div>
              <div className="absolute top-8 right-3 w-2 h-2 bg-gray-600/50 rounded-full"></div>
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-gray-600/40 rounded-full"></div>
              
              {/* Moon phase shadow */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20 rounded-full"></div>
            </div>
            
            {/* Orbital ring */}
            <div className="absolute inset-0 border-2 border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '8s' }}>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Floating particles around moon */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-60"
              style={{
                left: `${50 + 30 * Math.cos((i * Math.PI * 2) / 8)}%`,
                top: `${50 + 30 * Math.sin((i * Math.PI * 2) / 8)}%`,
                animationDelay: `${i * 0.2}s`,
                animation: `orbit ${4 + i * 0.2}s ease-in-out infinite`
              }}
            />
          ))}
        </div>
        
        {/* Loading Text with custom fonts */}
        <div className="space-y-4">
          <h1 
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 animate-pulse"
            style={{ fontFamily: 'JazzFont, serif' }}
          >
            Loading Moon
          </h1>
          
          <p 
            className="text-lg text-gray-300 opacity-80"
            style={{ fontFamily: 'Berdiolla, serif' }}
          >
            Preparing celestial experience...
          </p>
        </div>
        
        {/* Enhanced Loading Bar */}
        <div className="w-80 mx-auto mt-8 space-y-3">
          {/* Main progress bar */}
          <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/30">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-500/30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full"></div>
          </div>
          
          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full opacity-50"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animation: 'bounce 1.5s ease-in-out infinite'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Percentage or status text */}
        <div className="mt-6">
          <span 
            className="text-sm text-purple-300/70 tracking-wider uppercase"
            style={{ fontFamily: 'Berdiolla, serif' }}
          >
            Initializing 3D Environment
          </span>
        </div>
      </div>
      
      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Wrapper component to handle moon loading state
const MoonCanvasWrapper = ({ isGalleryPage }) => {
  const [moonLoaded, setMoonLoaded] = useState(false);

  return (
    <>
      {/* Show loading screen until moon is loaded */}
      {!moonLoaded && <MoonLoadingScreen />}
      
      {/* Canvas with moon */}
      <div 
        className="fixed top-0 left-0 w-full h-full transition-opacity duration-1000"
        style={{ 
          zIndex: 0,
          opacity: isGalleryPage ? 0.5 : 1,
          pointerEvents: "none"
        }}
      >
        <Canvas className="w-full h-full" camera={{ position: [0, 0, 7], fov: 45 }} shadows>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <MoonParticles onLoad={() => setMoonLoaded(true)} />
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
    </>
  );
};

export default function Layout() {
  const location = useLocation();
  const isGalleryPage = location.pathname === "/gallery";

  return (
    <div className="w-screen overflow-x-hidden bg-black text-white">
      <Suspense fallback={
        <div className="custom-fallback">
          <div className="spinner"></div>
        </div>
      }>
        <Navbar />
      </Suspense>
      
      {/* Moon Canvas with Loading */}
      <MoonCanvasWrapper isGalleryPage={isGalleryPage} />
      
      {/* Route content */}
      <div className="relative transition-all duration-500" style={{ zIndex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}