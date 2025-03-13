import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';
import gsap from 'gsap';
import generateParticlesFromMesh from './UseGenerateParticles';

export default function MoonParticles() {
    const moonRef = useRef();
    const particlesRef = useRef();
    const timeRef = useRef(0);
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const previousMouseRef = useRef(new THREE.Vector2(0, 0));
    const mouseVelocityRef = useRef(new THREE.Vector2(0, 0));
    const targetRotationRef = useRef(new THREE.Vector2(0, 0));
    const particleSystemStateRef = useRef({
        isInteracting: false,
        lastInteractionTime: 0,
        returnToRestTimeout: null
    });
    const loader = new GLTFLoader();
    const textureLoader = new TextureLoader();
    const { scene, camera, gl } = useThree();

    // Enhanced mouse tracking with inertia and state management
    useEffect(() => {
        const handleMouseMove = (event) => {
            // Store previous position for velocity calculation
            previousMouseRef.current.x = mouseRef.current.x;
            previousMouseRef.current.y = mouseRef.current.y;
            
            // Calculate normalized mouse position (-1 to 1)
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Calculate velocity (for more dynamic movement)
            mouseVelocityRef.current.x = mouseRef.current.x - previousMouseRef.current.x;
            mouseVelocityRef.current.y = mouseRef.current.y - previousMouseRef.current.y;
            
            // Update interaction state
            particleSystemStateRef.current.isInteracting = true;
            particleSystemStateRef.current.lastInteractionTime = Date.now();
            
            // Clear any existing timeout
            if (particleSystemStateRef.current.returnToRestTimeout) {
                clearTimeout(particleSystemStateRef.current.returnToRestTimeout);
            }
            
            // Set timeout to return to rest state
            particleSystemStateRef.current.returnToRestTimeout = setTimeout(() => {
                particleSystemStateRef.current.isInteracting = false;
            }, 2000); // Return to rest state after 2 seconds of inactivity
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (particleSystemStateRef.current.returnToRestTimeout) {
                clearTimeout(particleSystemStateRef.current.returnToRestTimeout);
            }
        };
    }, []);

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
            moonMesh.position.set(0, 0, 0);
            moonRef.current = moonMesh;

            // Generate enhanced particles with higher density
            const particles = generateParticlesFromMesh(moonMesh, 15); // Increased density for more particles
            if (particles) {
                particlesRef.current = particles;
                particles.scale.set(1.2, 1.2, 1.2); // Expanded scale for more expansive particles
                particles.position.set(0, 0, 0);
                
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
    }, [scene]);

    useFrame((state, delta) => {
        timeRef.current += delta;
        const time = timeRef.current;
        const isInteracting = particleSystemStateRef.current.isInteracting;
        
        // Enhanced camera movement with variable response to interaction state
        if (camera && mouseRef.current) {
            // Different sensitivity for interactive vs ambient movement
            const sensitivity = isInteracting ? 0.4 : 0.15;
            const dampingFactor = isInteracting ? 0.05 : 0.02;
            
            // Base movement influenced by mouse position
            const targetX = mouseRef.current.x * sensitivity;
            const targetY = mouseRef.current.y * sensitivity * 0.7;
            
            // Add subtle influence from mouse velocity for more dynamic interaction
            const velocityInfluence = isInteracting ? 0.3 : 0.1;
            const velocityX = mouseVelocityRef.current.x * velocityInfluence;
            const velocityY = mouseVelocityRef.current.y * velocityInfluence;
            
            // Combine position and velocity for more dynamic movement
            targetRotationRef.current.x += (targetY - targetRotationRef.current.x) * dampingFactor;
            targetRotationRef.current.y += (targetX - targetRotationRef.current.y) * dampingFactor;
            
            // Apply velocity for a momentum effect
            targetRotationRef.current.x += velocityY * 0.15;
            targetRotationRef.current.y += velocityX * 0.15;
            
            // Camera movement with enhanced damping
            camera.position.x += (targetRotationRef.current.y * 1.5 - camera.position.x) * 0.02;
            camera.position.y += (targetRotationRef.current.x - camera.position.y) * 0.02;
            camera.lookAt(0, 0, 0);
        }
        
        if (moonRef.current) {
            // Base rotation speed with added interaction-based variation
            const baseRotationSpeed = 0.0008;
            const interactionMultiplier = isInteracting ? 0.5 : 1.0;
            moonRef.current.rotation.y += baseRotationSpeed * interactionMultiplier;
        }

        if (particlesRef.current) {
            const particles = particlesRef.current;
            // Different rotation speed for particles creates parallax effect
            const particleRotationSpeed = 0.0003;
            particles.rotation.y += particleRotationSpeed;
            
            // Animate particles with enhanced movement
            const positions = particles.geometry.attributes.position.array;
            const sizes = particles.geometry.attributes.size.array;
            const colors = particles.geometry.attributes.color.array;
            const metadata = particles.userData.metadata;
            
            if (metadata && metadata.length > 0) {
                for (let i = 0; i < metadata.length; i++) {
                    const point = metadata[i];
                    const idx = i * 3;
                    
                    // Calculate animation parameters based on interaction state
                    const interactionFactor = isInteracting ? 2.5 : 1.0;
                    const restoreFactor = isInteracting ? 0.02 : 0.1;
                    
                    // Layer-specific mouse influence - more pronounced during interaction
                    let mouseInfluence;
                    switch (point.layerType) {
                        case 'core':
                            mouseInfluence = 0.005 * point.distanceFromSurface * interactionFactor;
                            break;
                        case 'middle':
                            mouseInfluence = 0.015 * point.distanceFromSurface * interactionFactor;
                            break;
                        case 'outer':
                            mouseInfluence = 0.03 * point.distanceFromSurface * interactionFactor;
                            break;
                    }
                    
                    // Add mouse velocity for more responsive movement
                    const velocityFactor = isInteracting ? 
                        (point.layerType === 'outer' ? 0.01 : 0.005) : 
                        (point.layerType === 'outer' ? 0.002 : 0.001);
                    
                    const velocityX = mouseVelocityRef.current.x * velocityFactor;
                    const velocityY = mouseVelocityRef.current.y * velocityFactor;
                    
                    const mouseOffsetX = mouseRef.current.x * mouseInfluence + velocityX;
                    const mouseOffsetY = mouseRef.current.y * mouseInfluence + velocityY;
                    
                    // Enhanced movement patterns based on layer type
                    let waveX, waveY, waveZ;
                    
                    // Different animation for each layer
                    switch (point.layerType) {
                        case 'core':
                            // Core particles: tighter orbital motion
                            const coreTimeFactor = time * point.frequency * 0.8;
                            waveX = Math.sin(coreTimeFactor + point.phase) * point.amplitude;
                            waveY = Math.cos(coreTimeFactor * 1.1 + point.phase) * point.amplitude;
                            waveZ = Math.sin(coreTimeFactor * 0.9 + point.phase * 1.2) * point.amplitude;
                            break;
                            
                        case 'middle':
                            // Middle particles: flowing wave patterns
                            const midTimeFactor = time * point.frequency;
                            waveX = Math.sin(midTimeFactor + point.phase) * point.amplitude * 1.2;
                            waveY = Math.cos(midTimeFactor * 1.3 + point.phase) * point.amplitude * 1.1;
                            waveZ = Math.sin(midTimeFactor * 0.7 + point.phase * 1.4) * point.amplitude * 1.4;
                            break;
                            
                        case 'outer':
                            // Outer particles: more chaotic, spiral movement
                            const outerTimeFactor = time * point.frequency * 0.6;
                            const spiralX = Math.sin(outerTimeFactor + point.phase) * point.spiralFactor * time;
                            const spiralY = Math.cos(outerTimeFactor + point.phase) * point.spiralFactor * time;
                            
                            waveX = Math.sin(outerTimeFactor + point.phase) * point.amplitude * 1.8 + spiralX;
                            waveY = Math.cos(outerTimeFactor * 0.9 + point.phase) * point.amplitude * 2.0 + spiralY;
                            waveZ = Math.sin(outerTimeFactor * 0.7 + point.phase * 1.5) * point.amplitude * 2.2;
                            break;
                    }
                    
                    // Calculate return to original position force (increases when not interacting)
                    const restoreX = (point.originalX - positions[idx]) * restoreFactor;
                    const restoreY = (point.originalY - positions[idx + 1]) * restoreFactor;
                    const restoreZ = (point.originalZ - positions[idx + 2]) * restoreFactor;
                    
                    // Apply all offsets with enhanced movement
                    positions[idx] = positions[idx] + waveX + mouseOffsetX + restoreX;
                    positions[idx + 1] = positions[idx + 1] + waveY + mouseOffsetY + restoreY;
                    positions[idx + 2] = positions[idx + 2] + waveZ + restoreZ;
                    
                    // Enhanced size variation based on interaction
                    const sizePulseSpeed = point.layerType === 'core' ? 0.4 : 
                                          (point.layerType === 'middle' ? 0.2 : 0.1);
                    const sizePulseAmount = isInteracting ? 
                                          (point.layerType === 'core' ? 0.1 : 0.2) : 
                                          (point.layerType === 'core' ? 0.05 : 0.1);
                    
                    const ageFactor = Math.sin(time * sizePulseSpeed + point.phase * 2);
                    sizes[i] = point.size * (1 + sizePulseAmount * ageFactor);
                    
                    // Subtle color pulsing for additional visual interest
                    const colorIdx = i * 3;
                    const colorPulse = Math.sin(time * 0.2 + point.phase) * 0.1 + 0.9;
                    
                    colors[colorIdx] = point.originalColor.r * colorPulse;
                    colors[colorIdx + 1] = point.originalColor.g * colorPulse;
                    colors[colorIdx + 2] = point.originalColor.b * colorPulse;
                }
                
                particles.geometry.attributes.position.needsUpdate = true;
                particles.geometry.attributes.size.needsUpdate = true;
                particles.geometry.attributes.color.needsUpdate = true;
            }
        }
    });

    return null;
}   