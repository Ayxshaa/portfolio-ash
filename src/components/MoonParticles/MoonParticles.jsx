import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei'; // Import Html for non-Three.js elements
import { useLocation } from 'react-router-dom';
import MoonParticlesCore from './MoonParticlesCore';
import MoonParticlesAnimation from './MoonParticlesAnimation';
import Title from '../UI/Title'; // Import Title component

export default function MoonParticles() {
    // Use refs for all 3D objects and interaction states
    const moonRef = useRef();
    const particlesRef = useRef();
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const previousMouseRef = useRef(new THREE.Vector2(0, 0));
    const mouseVelocityRef = useRef(new THREE.Vector2(0, 0));
    const targetRotationRef = useRef(new THREE.Vector2(0, 0));
    
    const raycasterRef = useRef(new THREE.Raycaster());
    const screenMouseRef = useRef(new THREE.Vector2(0, 0));
    
    // Add initialRenderComplete to track first render
    const [initialRenderComplete, setInitialRenderComplete] = useState(false);
    
    // Track current route
    const location = useLocation();
    
    // Particle system state reference with improved initial defaults
    const particleSystemStateRef = useRef({
        isInteracting: false,
        isMouseNearMoon: false,
        lastInteractionTime: 0,
        returnToRestTimeout: null,
        moonProximityThreshold: 2.5,
        isActive: true,
        // Add initial particle settings for better appearance
        particleDensity: 10, // Reduced from original
        particleIntensity: 0.85 // To match the image
    });
    
    // Setters for the refs that will be populated by MoonParticlesCore
    const setMoonRef = (mesh) => {
        moonRef.current = mesh;
    };
    
    const setParticlesRef = (particles) => {
        particlesRef.current = particles;
    };
    
    // Set initial render complete after first render
    useEffect(() => {
        if (!initialRenderComplete && moonRef.current && particlesRef.current) {
            setInitialRenderComplete(true);
            
            // Apply initial adjustments to match the desired appearance
            // Scale moon to match image
            moonRef.current.scale.set(0.95, 0.95, 0.95);
            
            // Adjust particle appearance to match image
            if (particlesRef.current.material) {
                // If using uniforms in material
                if (particlesRef.current.material.uniforms && 
                    particlesRef.current.material.uniforms.opacity) {
                    particlesRef.current.material.uniforms.opacity.value = 0.85;
                }
            }
        }
    }, [moonRef.current, particlesRef.current, initialRenderComplete]);
    
    // Effect to handle route changes and adjust animations accordingly
    useEffect(() => {
        if (!moonRef.current || !particlesRef.current) return;
        
        // Check if we're on the gallery page
        const isGalleryPage = location.pathname === '/gallery';
        
        if (isGalleryPage) {
            // Adjust moon and particles for gallery page
            console.log("Adjusting moon for gallery page");
            
            // Reduce the moon's scale
            moonRef.current.scale.set(0.8, 0.8, 0.8);
            
            // Make particles less intense
            if (particlesRef.current.material && 
                particlesRef.current.material.uniforms && 
                particlesRef.current.material.uniforms.opacity) {
                particlesRef.current.material.uniforms.opacity.value = 0.7;
            }
            
            // Modify interaction thresholds for gallery page
            particleSystemStateRef.current.moonProximityThreshold = 2.0;
        } else {
            // Reset for normal pages - but keep our optimized settings
            console.log("Resetting moon for normal page");
            
            // Reset moon scale to our optimized value
            moonRef.current.scale.set(0.95, 0.95, 0.95);
            
            // Reset particle opacity to our optimized value
            if (particlesRef.current.material && 
                particlesRef.current.material.uniforms && 
                particlesRef.current.material.uniforms.opacity) {
                particlesRef.current.material.uniforms.opacity.value = 0.85;
            }
            
            // Reset interaction thresholds
            particleSystemStateRef.current.moonProximityThreshold = 2.5;
        }
        
    }, [location]);

    // Pass the optimized particle settings to MoonParticlesCore
    return (
        <>
            <MoonParticlesCore 
                setMoonRef={setMoonRef}
                setParticlesRef={setParticlesRef}
                particleSystemStateRef={particleSystemStateRef}
                initialSettings={{
                    particleDensity: 10, // Reduced density
                    particleScale: 0.95, // Slightly smaller particles
                    particleOpacity: 0.85 // Adjusted opacity
                }}
            />
            
            <MoonParticlesAnimation 
                moonRef={moonRef}
                particlesRef={particlesRef}
                mouseRef={mouseRef}
                previousMouseRef={previousMouseRef}
                mouseVelocityRef={mouseVelocityRef}
                targetRotationRef={targetRotationRef}
                particleSystemStateRef={particleSystemStateRef}
                raycasterRef={raycasterRef}
                screenMouseRef={screenMouseRef}
            />

            {/* Wrap Title in <Html> so it renders properly inside Three.js */}
            <Html position={[0, -2, 0]} center>
                <div className='w-screen flex justify-center mt-4'>
                    <Title />
                </div>
            </Html>
        </>
    );
}