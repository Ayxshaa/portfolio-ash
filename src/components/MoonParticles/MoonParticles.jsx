// Updated version of MoonParticles.jsx with optimized React imports
import React, { useRef, useEffect, useState } from 'react'; // Explicit React import
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useLocation } from 'react-router-dom';
import MoonParticlesCore from './MoonParticlesCore';
import MoonParticlesAnimation from './MoonParticlesAnimation';
import Title from '../UI/Title';

// Using explicit React.memo can help with certain bundling issues
const MoonParticles = React.memo(() => {
    // Use refs for all 3D objects and interaction states
    const moonRef = useRef();
    const particlesRef = useRef();
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const previousMouseRef = useRef(new THREE.Vector2(0, 0));
    const mouseVelocityRef = useRef(new THREE.Vector2(0, 0));
    const targetRotationRef = useRef(new THREE.Vector2(0, 0));
    
    const raycasterRef = useRef(new THREE.Raycaster());
    const screenMouseRef = useRef(new THREE.Vector2(0, 0));
    
    const [initialRenderComplete, setInitialRenderComplete] = useState(false);
    
    const location = useLocation();
    
    const particleSystemStateRef = useRef({
        isInteracting: false,
        isMouseNearMoon: false,
        lastInteractionTime: 0,
        returnToRestTimeout: null,
        moonProximityThreshold: 2.5,
        isActive: true,
        particleDensity: 10,
        particleIntensity: 0.85
    });
    
    const setMoonRef = (mesh) => {
        moonRef.current = mesh;
    };
    
    const setParticlesRef = (particles) => {
        particlesRef.current = particles;
    };
    
    useEffect(() => {
        if (!initialRenderComplete && moonRef.current && particlesRef.current) {
            setInitialRenderComplete(true);
            
            moonRef.current.scale.set(0.95, 0.95, 0.95);
            
            if (particlesRef.current.material) {
                if (particlesRef.current.material.uniforms && 
                    particlesRef.current.material.uniforms.opacity) {
                    particlesRef.current.material.uniforms.opacity.value = 0.85;
                }
            }
        }
    }, [moonRef.current, particlesRef.current, initialRenderComplete]);
    
    useEffect(() => {
        if (!moonRef.current || !particlesRef.current) return;
        
        const isGalleryPage = location.pathname === '/gallery';
        
        if (isGalleryPage) {
            console.log("Adjusting moon for gallery page");
            
            moonRef.current.scale.set(0.8, 0.8, 0.8);
            
            if (particlesRef.current.material && 
                particlesRef.current.material.uniforms && 
                particlesRef.current.material.uniforms.opacity) {
                particlesRef.current.material.uniforms.opacity.value = 0.7;
            }
            
            particleSystemStateRef.current.moonProximityThreshold = 2.0;
        } else {
            console.log("Resetting moon for normal page");
            
            moonRef.current.scale.set(0.95, 0.95, 0.95);
            
            if (particlesRef.current.material && 
                particlesRef.current.material.uniforms && 
                particlesRef.current.material.uniforms.opacity) {
                particlesRef.current.material.uniforms.opacity.value = 0.85;
            }
            
            particleSystemStateRef.current.moonProximityThreshold = 2.5;
        }
        
    }, [location]);

    return (
        <>
            <MoonParticlesCore 
                setMoonRef={setMoonRef}
                setParticlesRef={setParticlesRef}
                particleSystemStateRef={particleSystemStateRef}
                initialSettings={{
                    particleDensity: 10,
                    particleScale: 0.95,
                    particleOpacity: 0.85
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

            <Html position={[0, -2, 0]} center>
                <div className='w-screen flex justify-center mt-4'>
                    <Title />
                </div>
            </Html>
        </>
    );
});

export default MoonParticles;