// Fixed version of generateParticlesFromMesh.js
import * as THREE from 'three';

export default function generateParticlesFromMesh(mesh, density = 15) {
    // First ensure THREE.js is fully loaded and initialized
    if (!THREE || !THREE.BufferGeometry) {
        console.error("THREE.js not fully loaded");
        return null;
    }

    if (!mesh || !mesh.geometry) {
        console.error("❌ Mesh or geometry is undefined!");
        return null;
    }

    const geometry = mesh.geometry;
    const positions = geometry.attributes.position?.array;

    if (!positions) {
        console.error("❌ Geometry does not contain position attributes!");
        return null;
    }

    console.log("✅ Positions Loaded:", positions.length);

    // Ensure geometry has a bounding sphere
    if (!geometry.boundingSphere) {
        geometry.computeBoundingSphere();
    }
    
    const moonRadius = geometry.boundingSphere?.radius || 1;
    const center = new THREE.Vector3();
    if (geometry.boundingSphere) {
        center.copy(geometry.boundingSphere.center);
    }

    const particlePositions = [];
    const particleMetadata = [];
    const particleSizes = [];
    const particleColors = [];
    
    // Enhanced distribution with multiple layers for depth
    const normalizeAndOffset = (x, y, z) => {
        const vector = new THREE.Vector3(x, y, z).sub(center).normalize();
        
        // Creating three distinct layers of particles
        const rand = Math.random();
        let layerType;
        
        if (rand < 0.4) {
            layerType = 'core';
        } else if (rand < 0.8) {
            layerType = 'middle';
        } else {
            layerType = 'outer';
        }
        
        let distance;
        switch (layerType) {
            case 'core':
                distance = (0.03 + Math.random() * 0.12) * moonRadius;
                break;
            case 'middle':
                distance = (0.15 + Math.random() * 0.25) * moonRadius;
                break;
            case 'outer':
                distance = (0.3 + Math.random() * 0.5) * moonRadius;
                break;
        }
        
        return {
            x: x + (vector.x * distance),
            y: y + (vector.y * distance),
            z: z + (vector.z * distance),
            layer: layerType
        };
    };

    // Enhanced particle color with purple theme gradient based on distance
    // Theme color: #704995 (Purple)
    const getParticleColor = (layerType, distFactor) => {
        const color = new THREE.Color();
        
        // Base theme color in RGB: #704995 = rgb(112, 73, 149)
        const themeR = 112 / 255;  // 0.439
        const themeG = 73 / 255;   // 0.286
        const themeB = 149 / 255;  // 0.584
        
        switch (layerType) {
            case 'core':
                // Core particles: bright purple with white highlights
                const coreBrightness = Math.min(0.9 + Math.random() * 0.1, 1.0);
                color.setRGB(
                    coreBrightness * themeR + 0.3,
                    coreBrightness * themeG + 0.2,
                    coreBrightness * themeB + 0.4
                );
                break;
            case 'middle':
                // Middle particles: medium purple transitioning to lighter purple
                const midBrightness = 0.75 + Math.random() * 0.25;
                color.setRGB(
                    midBrightness * themeR + 0.2,
                    midBrightness * themeG + 0.15,
                    midBrightness * themeB + 0.3
                );
                break;
            case 'outer':
                // Outer particles: lighter purple-white
                const outerBrightness = 0.7 + Math.random() * 0.3;
                color.setRGB(
                    outerBrightness * themeR + 0.4,
                    outerBrightness * themeG + 0.3,
                    outerBrightness * themeB + 0.5
                );
                break;
        }
        
        return color;
    };

    // Strategic particle placement with variable density
    for (let i = 0; i < positions.length; i += 3) {
        const vertexX = positions[i];
        const vertexY = positions[i + 1];
        const vertexZ = positions[i + 2];
        
        const vertexPosition = new THREE.Vector3(vertexX, vertexY, vertexZ);
        const distanceFromCenter = vertexPosition.distanceTo(center) / moonRadius;
        
        // Variable density based on position
        let particlesAtThisVertex;
        
        // Create more particles at interesting contours
        const normalizedHeight = (vertexY - center.y) / moonRadius + 0.5;
        if (normalizedHeight > 0.7 || normalizedHeight < 0.3) {
            // Create more particles at top and bottom regions
            particlesAtThisVertex = Math.floor(density * (1.2 + Math.random() * 0.8));
        } else {
            particlesAtThisVertex = Math.floor(density * (0.6 + Math.random() * 0.8));
        }
        
        for (let j = 0; j < particlesAtThisVertex; j++) {
            const offset = normalizeAndOffset(vertexX, vertexY, vertexZ);
            const x = offset.x;
            const y = offset.y;
            const z = offset.z;
            const layerType = offset.layer;
            
            const pos = new THREE.Vector3(x, y, z);
            const distFactor = pos.distanceTo(center) / (moonRadius * 1.5);
            
            particlePositions.push(x, y, z);
            
            // Variable particle sizes based on layer and position
            let size;
            switch (layerType) {
                case 'core':
                    size = (0.01 + Math.random() * 0.06) * moonRadius;
                    break;
                case 'middle':
                    size = (0.008 + Math.random() * 0.05) * moonRadius;
                    break;
                case 'outer':
                    size = (0.005 + Math.random() * 0.04) * moonRadius;
                    break;
            }
            particleSizes.push(size);
            
            const color = getParticleColor(layerType, distFactor);
            particleColors.push(color.r, color.g, color.b);
            
            // Enhanced movement parameters for more dynamic animation
            const baseSpeed = layerType === 'core' ? 0.2 : (layerType === 'middle' ? 0.15 : 0.1);
            const amplitudeMultiplier = layerType === 'core' ? 0.5 : (layerType === 'middle' ? 1.0 : 2.0);
            
            particleMetadata.push({
                originalX: x,
                originalY: y,
                originalZ: z,
                // Movement parameters with layer-specific values
                amplitude: (0.004 + Math.random() * 0.01) * amplitudeMultiplier,
                frequency: (baseSpeed + Math.random() * 0.1) / 10,
                phase: Math.random() * Math.PI * 2,
                distanceFromSurface: distFactor,
                size: size,
                layerType: layerType,
                spiralFactor: Math.random() * 0.02,
                spiralSpeed: (0.02 + Math.random() * 0.03) * (Math.random() > 0.5 ? 1 : -1),
                originalColor: {r: color.r, g: color.g, b: color.b}
            });
        }
    }

    try {
        // Create a new buffer geometry safely
        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
        particlesGeometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));
        particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

        // Enhanced vertex shader with improved depth handling
        const vertexShader = `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vDepth;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                // Enhanced depth-based sizing for more dramatic visual
                float depth = -mvPosition.z;
                vDepth = depth;
                
                // Size adjustment based on depth
                float sizeScale = 380.0 / depth;
                gl_PointSize = size * sizeScale;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        
        // Fragment shader with enhanced glow effect
        const fragmentShader = `
            varying vec3 vColor;
            varying float vDepth;
            
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                
                // Softer edges with enhanced glow
                float depthFactor = clamp(vDepth / 12.0, 0.4, 1.0);
                float alpha = depthFactor * pow(1.0 - dist * 1.8, 1.5);
                
                // Enhanced center glow
                float centerIntensity = 1.0 + (1.0 - dist * 2.0) * 0.4;
                vec3 glowColor = vColor * centerIntensity;
                
                gl_FragColor = vec4(glowColor, alpha);
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                opacity: { value: 1.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particles = new THREE.Points(particlesGeometry, material);
        particles.userData.metadata = particleMetadata;
        
        return particles;
    } catch (error) {
        console.error("Error creating particle system:", error);
        
        // Fallback to a simple particle system
        try {
            console.log("Attempting to create fallback particle system");
            const particlesGeometry = new THREE.BufferGeometry();
            particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
            
            const material = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.05,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            
            return new THREE.Points(particlesGeometry, material);
        } catch (fallbackError) {
            console.error("Failed to create fallback particle system:", fallbackError);
            return null;
        }
    }
}