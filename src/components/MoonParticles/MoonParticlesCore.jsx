import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

import gsap from 'gsap';
import generateParticlesFromMesh from './UseGenerateParticles';

// Preload the model to improve load times
useGLTF.preload('/models/moon.glb');

export default function MoonParticlesCore({ 
  setMoonRef, 
  setParticlesRef, 
  particleSystemStateRef,
  onComponentReady // New prop to signal when component is fully loaded
}) {
  const { scene } = useThree();
  const loadingStateRef = useRef({
    modelLoaded: false,
    textureLoaded: false,
    particlesGenerated: false,
    animationsStarted: false
  });

  // Lazy load the model using useGLTF hook for better performance
  const { scene: moonModel } = useGLTF('/models/moon.glb');
  const textureLoader = new THREE.TextureLoader();

  // Function to check if everything is loaded and ready
  const checkIfFullyReady = () => {
    const state = loadingStateRef.current;
    if (state.modelLoaded && state.textureLoaded && state.particlesGenerated && state.animationsStarted) {
      console.log("MoonParticlesCore fully loaded and ready");
      if (onComponentReady) {
        // Small delay to ensure all animations have started
        setTimeout(() => {
          onComponentReady();
        }, 100);
      }
    }
  };

  useEffect(() => {
    console.log("Moon model loaded:", moonModel);
    
    // Debug: Log the structure of the model to understand what we're working with
    console.log("Model children:", moonModel.children);
    
    let moonMesh = null;
    
    // First attempt: Check if there's a direct mesh in the scene
    moonModel.traverse((child) => {
      console.log("Child found:", child.type, child.name);
      if (child.isMesh) {
        console.log("Mesh found:", child.name);
        moonMesh = child;
      }
    });
    
    // If no mesh was found, create a simple sphere as a fallback
    if (!moonMesh) {
      console.warn("No mesh found in the model, creating a sphere as fallback");
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.9,
        metalness: 0.1,
      });
      moonMesh = new THREE.Mesh(geometry, material);
      moonMesh.name = "FallbackMoon";
    }
    
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;

    // Mark model as loaded
    loadingStateRef.current.modelLoaded = true;

    // Load the texture for the moon
    textureLoader.load('/models/moon_first.jpg', 
      // Success callback
      (texture) => {
        console.log("Moon texture loaded successfully");
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Apply texture to the moon material
        moonMesh.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.9,
          metalness: 0.1,
          emissive: new THREE.Color(0x331100),
          emissiveMap: texture,
          emissiveIntensity: 0.2,
        });

        // Mark texture as loaded
        loadingStateRef.current.textureLoaded = true;

        // Fade-in animation for the moon material
        gsap.fromTo(moonMesh.material, 
          { opacity: 0 }, 
          { 
            opacity: 1, 
            duration: 3.0, 
            ease: "power2.out",
            onComplete: () => {
              loadingStateRef.current.animationsStarted = true;
              checkIfFullyReady();
            }
          }
        );
      },
      // Progress callback
      (progress) => {
        console.log("Texture loading progress:", (progress.loaded / progress.total * 100) + '%');
      },
      // Error callback
      (error) => {
        console.error("Error loading moon texture:", error);
        // Even if texture fails, mark as loaded so we don't block forever
        loadingStateRef.current.textureLoaded = true;
        loadingStateRef.current.animationsStarted = true;
        checkIfFullyReady();
      }
    );

    // Set moon mesh properties
    moonMesh.scale.set(1, 1, 1);
    
    // Ensure material is created and set to transparent before animations
    if (!moonMesh.material) {
      moonMesh.material = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.9,
        metalness: 0.1,
      });
    }
    
    moonMesh.material.transparent = true;
    moonMesh.position.set(0, 1, 0);

    // Set moon reference for external use
    setMoonRef(moonMesh);

    // Generate and animate enhanced particles around the moon mesh
    const particles = generateParticlesFromMesh(moonMesh, 15);
    if (particles) {
      console.log("Particles generated successfully");
      setParticlesRef(particles);
      particles.scale.set(1.2, 1.2, 1.2);
      particles.position.set(0, 1, 0);

      // Mark particles as generated
      loadingStateRef.current.particlesGenerated = true;

      // Animation for particles scaling in and out with a breathing effect
      gsap.timeline()
        .fromTo(
          particles.scale,
          { x: 2.5, y: 2.5, z: 2.5 },
          { x: 1.2, y: 1.2, z: 1.2, duration: 5, ease: "expo.out" }
        )
        .to(particles.scale, {
          x: 1.3, y: 1.3, z: 1.3,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

      // Initial fade-in effect for particles
      if (particles.material && particles.material.uniforms && particles.material.uniforms.opacity) {
        gsap.fromTo(
          particles.material.uniforms.opacity,
          { value: 0 },
          { value: 1, duration: 4, ease: "power2.out" }
        );
      }

      // Add particles to the scene
      scene.add(particles);
    } else {
      console.warn("Failed to generate particles");
      // Mark as generated even if failed, so we don't block loading
      loadingStateRef.current.particlesGenerated = true;
    }

    // Add moon mesh to the scene
    scene.add(moonMesh);

    // Check if ready (in case texture is cached and loads immediately)
    checkIfFullyReady();

    // Cleanup the effect if the component unmounts
    return () => {
      if (moonMesh) {
        scene.remove(moonMesh);
        if (moonMesh.material) {
          moonMesh.material.dispose();
        }
        if (moonMesh.geometry) {
          moonMesh.geometry.dispose();
        }
      }
      
      if (particles) {
        scene.remove(particles);
        if (particles.material) {
          particles.material.dispose();
        }
        if (particles.geometry) {
          particles.geometry.dispose();
        }
      }
    };
  }, [moonModel, scene, setMoonRef, setParticlesRef]);

  return null;
}