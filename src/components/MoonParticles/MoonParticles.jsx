import { useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei'; // Import Html for non-Three.js elements
import MoonParticlesCore from './MoonParticlesCore';
import MoonParticlesAnimation from './MoonParticlesAnimation';
import  Title  from '../UI/Title'; // Import Title component

export default function MoonParticles() {
    const moonRef = useRef();
    const particlesRef = useRef();
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const previousMouseRef = useRef(new THREE.Vector2(0, 0));
    const mouseVelocityRef = useRef(new THREE.Vector2(0, 0));
    const targetRotationRef = useRef(new THREE.Vector2(0, 0));
    
    const raycasterRef = useRef(new THREE.Raycaster());
    const screenMouseRef = useRef(new THREE.Vector2(0, 0));
    
    const particleSystemStateRef = useRef({
        isInteracting: false,
        isMouseNearMoon: false,
        lastInteractionTime: 0,
        returnToRestTimeout: null,
        moonProximityThreshold: 2.5,
    });

    const setMoonRef = (mesh) => {
        moonRef.current = mesh;
    };

    const setParticlesRef = (particles) => {
        particlesRef.current = particles;
    };

    return (
        <>
            <MoonParticlesCore 
                setMoonRef={setMoonRef}
                setParticlesRef={setParticlesRef}
                particleSystemStateRef={particleSystemStateRef}
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
