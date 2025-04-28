import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'; // Using useGLTF hook for efficient model loading
import * as THREE from 'three';
import gsap from 'gsap';
import generateParticlesFromMesh from './UseGenerateParticles';

// Preload the model to improve load times
useGLTF.preload('/models/moon.glb'); // Path relative to the 'public' directory

export default function MoonParticlesCore({ 
  setMoonRef, 
  setParticlesRef, 
  particleSystemStateRef 
}) {
  const { scene } = useThree();

  // Lazy load the model using useGLTF hook for better performance
  const { scene: moonModel } = useGLTF('/models/moon.glb'); // Path relative to the 'public' directory
  const textureLoader = new THREE.TextureLoader();

  useEffect(() => {
    let moonMesh = null;

    // Traverse the model to find the mesh (moon) and apply texture and material properties
    moonModel.traverse((child) => {
      if (child.isMesh) {
        moonMesh = child;
        moonMesh.castShadow = true;
        moonMesh.receiveShadow = true;
      }
    });

    if (!moonMesh) {
      console.error("❌ Moon mesh not found!");
      return;
    }

    // Load the texture for the moon
    textureLoader.load('/models/moon_first.jpg', (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Apply a warmer emissive color to the moon texture
      moonMesh.material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.9,
        metalness: 0.1,
        emissive: new THREE.Color(0x331100), // Warm emissive color
        emissiveMap: texture,
        emissiveIntensity: 0.2,
      });

      // Fade-in animation for the moon material
      gsap.fromTo(moonMesh.material, 
        { opacity: 0 }, 
        { opacity: 1, duration: 3.0, ease: "power2.out" }
      );
    });

    // Set moon mesh properties
    moonMesh.scale.set(1, 1, 1);
    moonMesh.material.transparent = true;
    moonMesh.position.set(0, 1, 0);

    // Set moon reference for external use
    setMoonRef(moonMesh);

    // Generate and animate enhanced particles around the moon mesh
    const particles = generateParticlesFromMesh(moonMesh, 15); // Increased particle density
    if (particles) {
      setParticlesRef(particles);
      particles.scale.set(1.2, 1.2, 1.2); // Expanded particle scale for visual impact
      particles.position.set(0, 1, 0);

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
      gsap.fromTo(
        particles.material.uniforms.opacity,
        { value: 0 },
        { value: 1, duration: 4, ease: "power2.out" }
      );

      // Add particles to the scene
      scene.add(particles);
    }

    // Add moon mesh to the scene
    scene.add(moonMesh);

    // Cleanup the effect if the component unmounts
    return () => {
      // Clean up resources if needed (remove the moon and particles)
      scene.remove(moonMesh);
      scene.remove(particles);
    };
  }, [moonModel, scene, setMoonRef, setParticlesRef]);

  return null;
}
