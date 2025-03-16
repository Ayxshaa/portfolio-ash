import { useRef } from 'react';
import * as THREE from 'three';
import MoonParticlesCore from './MoonParticlesCore';
import MoonParticlesAnimation from './MoonParticlesAnimation';

export default function MoonParticles() {
    // Create all the refs needed for both components
    const moonRef = useRef();
    const particlesRef = useRef();
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const previousMouseRef = useRef(new THREE.Vector2(0, 0));
    const mouseVelocityRef = useRef(new THREE.Vector2(0, 0));
    const targetRotationRef = useRef(new THREE.Vector2(0, 0));
    
    // Add raycaster for detecting when mouse is over the moon
    const raycasterRef = useRef(new THREE.Raycaster());
    const screenMouseRef = useRef(new THREE.Vector2(0, 0));
    
    const particleSystemStateRef = useRef({
        isInteracting: false,
        isMouseNearMoon: false,
        lastInteractionTime: 0,
        returnToRestTimeout: null,
        // Add moon proximity settings
        moonProximityThreshold: 2.5, // Adjust this value to control how close the cursor needs to be to the moon
    });

    // Helpers to set refs from the child component
    const setMoonRef = (mesh) => {
        moonRef.current = mesh;
    };

    const setParticlesRef = (particles) => {
        particlesRef.current = particles;
    };

    return (
        <>
            {/* Component responsible for loading models and creating particles */}
            <MoonParticlesCore 
                setMoonRef={setMoonRef}
                setParticlesRef={setParticlesRef}
                particleSystemStateRef={particleSystemStateRef}
            />
            
            {/* Component responsible for animations and interactions */}
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
        </>
    );
}