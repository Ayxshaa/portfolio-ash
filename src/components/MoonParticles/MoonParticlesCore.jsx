import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';
import gsap from 'gsap';
import generateParticlesFromMesh from './UseGenerateParticles';

// This component handles the loading and setup of the moon and its particles
export default function MoonParticlesCore({ 
  setMoonRef, 
  setParticlesRef, 
  particleSystemStateRef 
}) {
    const loader = new GLTFLoader();
    const textureLoader = new TextureLoader();
    const { scene } = useThree();

    useEffect(() => {
        loader.load('/moon.glb', (gltf) => {
            console.log("✅ Moon Model Loaded:", gltf);

            let moonMesh = null;
            gltf.scene.traverse((child) => {
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

            // Enhanced texture with better material properties for warmer appearance
            textureLoader.load('/moon_first.jpg', (texture) => {
                // Improved texture filtering for better quality
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                
                // Warmer moon texture to match particle colors
                moonMesh.material = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.9,
                    metalness: 0.1,
                    emissive: new THREE.Color(0x331100), // Warmer emissive color
                    emissiveMap: texture,
                    emissiveIntensity: 0.2
                });
                
                // More dramatic fade-in animation
                gsap.fromTo(
                    moonMesh.material, 
                    { opacity: 0 },
                    { opacity: 1, duration: 3.0, ease: "power2.out" }
                );
            });

            moonMesh.scale.set(1, 1, 1);
            moonMesh.material.transparent = true;
            moonMesh.position.set(0, 1, 0);
            setMoonRef(moonMesh);

            // Generate enhanced particles with higher density
            const particles = generateParticlesFromMesh(moonMesh, 15); // Increased density for more particles
            if (particles) {
                setParticlesRef(particles);
                particles.scale.set(1.2, 1.2, 1.2); // Expanded scale for more expansive particles
                particles.position.set(0, 1, 0);
                
                // More dramatic animated introduction
                gsap.timeline()
                    .fromTo(
                        particles.scale,
                        { x: 2.5, y: 2.5, z: 2.5 },
                        { x: 1.2, y: 1.2, z: 1.2, duration: 5, ease: "expo.out" }
                    )
                    // Subtle continuous breathing effect
                    .to(particles.scale, {
                        x: 1.3, y: 1.3, z: 1.3,
                        duration: 8,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                    
                // Initial fade-in for particles
                gsap.fromTo(
                    particles.material.uniforms.opacity,
                    { value: 0 },
                    { value: 1, duration: 4, ease: "power2.out" }
                );
                
                // Add particles to scene
                scene.add(particles);
            }
            
            // Add moon to scene
            scene.add(moonMesh);
        }, undefined, (error) => {
            console.error("❌ Error Loading Moon Model:", error);
        });
        
        // Effect cleanup
        return () => {
            // Cleanup would go here if needed
        };
    }, [scene, setMoonRef, setParticlesRef]);

    return null;
}