import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// This component handles the animation and interaction for the moon and its particles
export default function MoonParticlesAnimation({ 
  moonRef, 
  particlesRef, 
  mouseRef, 
  previousMouseRef, 
  mouseVelocityRef, 
  targetRotationRef, 
  particleSystemStateRef,
  raycasterRef,
  screenMouseRef
}) {
    const timeRef = useRef(0);
    const { camera, scene } = useThree();

    // Enhanced mouse tracking with proximity detection
    useEffect(() => {
        const handleMouseMove = (event) => {
            // Store previous position for velocity calculation
            previousMouseRef.current.x = mouseRef.current.x;
            previousMouseRef.current.y = mouseRef.current.y;
            
            // Calculate normalized mouse position (-1 to 1)
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Update screen mouse position for raycaster
            screenMouseRef.current.x = mouseRef.current.x;
            screenMouseRef.current.y = mouseRef.current.y;
            
            // Calculate velocity (for more dynamic movement)
            mouseVelocityRef.current.x = mouseRef.current.x - previousMouseRef.current.x;
            mouseVelocityRef.current.y = mouseRef.current.y - previousMouseRef.current.y;
            
            // Check if moon exists before performing proximity check
            if (moonRef.current) {
                // Use raycaster to check if mouse is over the moon
                raycasterRef.current.setFromCamera(screenMouseRef.current, camera);
                
                // First check if mouse is directly over the moon
                const intersects = raycasterRef.current.intersectObject(moonRef.current);
                let isDirectlyOverMoon = intersects.length > 0;
                
                // If not directly over, check proximity
                if (!isDirectlyOverMoon) {
                    // Calculate 3D world position from screen coordinates
                    const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0);
                    vector.unproject(camera);
                    const dir = vector.sub(camera.position).normalize();
                    const distance = -camera.position.z / dir.z;
                    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
                    
                    // Calculate distance to moon center
                    const moonPosition = moonRef.current.position;
                    const distanceToMoon = pos.distanceTo(moonPosition);
                    
                    // Check if close enough to the moon
                    particleSystemStateRef.current.isMouseNearMoon = 
                        distanceToMoon < particleSystemStateRef.current.moonProximityThreshold;
                } else {
                    // Mouse is directly over moon
                    particleSystemStateRef.current.isMouseNearMoon = true;
                }
                
                // Only set interacting if mouse is near the moon
                if (particleSystemStateRef.current.isMouseNearMoon) {
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
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (particleSystemStateRef.current.returnToRestTimeout) {
                clearTimeout(particleSystemStateRef.current.returnToRestTimeout);
            }
        };
    }, [mouseRef, previousMouseRef, mouseVelocityRef, particleSystemStateRef, camera, moonRef, raycasterRef, screenMouseRef]);

    useFrame((state, delta) => {
        timeRef.current += delta;
        const time = timeRef.current;
        
        // Only react if the mouse is near the moon
        const isInteracting = particleSystemStateRef.current.isInteracting && 
                              particleSystemStateRef.current.isMouseNearMoon;
        
        // Enhanced camera movement with variable response to interaction state
        if (camera && mouseRef.current) {
            // Different sensitivity for interactive vs ambient movement
            const sensitivity = isInteracting ? 0.4 : 0.15;
            const dampingFactor = isInteracting ? 0.05 : 0.02;
            
            // Base movement influenced by mouse position - only apply if near moon
            const targetX = isInteracting ? mouseRef.current.x * sensitivity : 0;
            const targetY = isInteracting ? mouseRef.current.y * sensitivity * 0.7 : 0;
            
            // Add subtle influence from mouse velocity for more dynamic interaction
            const velocityInfluence = isInteracting ? 0.3 : 0.1;
            const velocityX = isInteracting ? mouseVelocityRef.current.x * velocityInfluence : 0;
            const velocityY = isInteracting ? mouseVelocityRef.current.y * velocityInfluence : 0;
            
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
        
        if (moonRef && moonRef.current) {
            // Base rotation speed with added interaction-based variation
            const baseRotationSpeed = 0.0008;
            const interactionMultiplier = isInteracting ? 0.5 : 1.0;
            moonRef.current.rotation.y += baseRotationSpeed * interactionMultiplier;
        }

        if (particlesRef && particlesRef.current) {
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
                    
                    const mouseOffsetX = isInteracting ? mouseRef.current.x * mouseInfluence + velocityX : 0;
                    const mouseOffsetY = isInteracting ? mouseRef.current.y * mouseInfluence + velocityY : 0;
                    
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