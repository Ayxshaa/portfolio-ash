  import React, { useRef, useMemo } from 'react';
  import { useFrame } from '@react-three/fiber';
  import * as THREE from 'three';

  const CurvedParticles = ({ startPos, endPos, controlPoint, particleCount = 80, isActive = true, animationStartTime = 0 }) => {
    const particlesRef = useRef();
    const timeRef = useRef(0);
    const startTimeRef = useRef(null);
    const metadataRef = useRef([]);

    // Generate particles along curve using MoonParticles style
    const { geometry, material, metadata } = useMemo(() => {
      const positions = [];
      const colors = [];
      const sizes = [];
      const metadata = [];

      // Create bezier curve for diagonal path
      const curve = new THREE.QuadraticBezierCurve3(startPos, controlPoint, endPos);

      // Generate particles with staggered start times for wave effect
      for (let i = 0; i < particleCount; i++) {
        const t = i / (particleCount - 1);
        const basePoint = curve.getPoint(t);
        
        // Store original position
        const originalX = basePoint.x;
        const originalY = basePoint.y;
        const originalZ = basePoint.z;

        // Initial position - start off-screen at top-right
        positions.push(originalX, originalY, originalZ);

        // Create gradient color from warm to cool
        const color = new THREE.Color();
        if (t < 0.5) {
          // First half: golden/warm colors
          const warmFactor = 1 - (t * 2);
          const warmth = 0.8 + Math.random() * 0.2;
          color.setRGB(
            warmth,
            warmth * (0.7 + Math.random() * 0.2),
            warmth * (0.4 + Math.random() * 0.3)
          );
        } else {
          // Second half: cool colors
          const coolFactor = (t - 0.5) * 2;
          const coolness = 0.7 + Math.random() * 0.3;
          color.setRGB(
            coolness * (0.6 + coolFactor * 0.2),
            coolness * (0.5 + coolFactor * 0.3),
            coolness
          );
        }

        colors.push(color.r, color.g, color.b);

        // Variable particle sizes
        const size = 0.02 + Math.random() * 0.08;
        sizes.push(size);

        // Store metadata for animation
        metadata.push({
          t: t,
          originalX: originalX,
          originalY: originalY,
          originalZ: originalZ,
          size: size,
          originalColor: { r: color.r, g: color.g, b: color.b },
          frequency: 0.8 + Math.random() * 0.4, // Wave frequency
          phase: Math.random() * Math.PI * 2, // Random phase for wave variation
          amplitude: 0.3 + Math.random() * 0.4, // Horizontal wobble amplitude
          speed: 0.15 + Math.random() * 0.2, // Movement speed along diagonal
          startDelay: t * 2.0, // Stagger particles for wave effect
          layerType: i < particleCount * 0.3 ? 'core' : (i < particleCount * 0.7 ? 'middle' : 'outer')
        });
      }

      // Store metadata in ref for useFrame access
      metadataRef.current = metadata;
      
      // Create geometry
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
      geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      // Create shader material (same as MoonParticles)
      const vertexShader = `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDepth;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          float depth = -mvPosition.z;
          vDepth = depth;
          
          float sizeScale = 380.0 / depth;
          gl_PointSize = size * sizeScale;
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragmentShader = `
        varying vec3 vColor;
        varying float vDepth;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float depthFactor = clamp(vDepth / 12.0, 0.4, 1.0);
          float alpha = depthFactor * pow(1.0 - dist * 1.8, 1.5);
          
          float centerIntensity = 1.0 + (1.0 - dist * 2.0) * 0.4;
          vec3 glowColor = vColor * centerIntensity;
          
          gl_FragColor = vec4(glowColor, alpha);
        }
      `;

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          opacity: { value: 1.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      return { geometry: geom, material: mat, metadata };
    }, [startPos, endPos, controlPoint, particleCount]);

    // Animate particles with sine wave motion
    useFrame((state, delta) => {
      // Only animate if active and animation has started
      if (!isActive || !animationStartTime || animationStartTime === 0) return;
      
      // Reset time when animation starts
      if (startTimeRef.current !== animationStartTime) {
        startTimeRef.current = animationStartTime;
        timeRef.current = 0;
      }
      
      timeRef.current += delta;
      const elapsedTime = timeRef.current;

      if (particlesRef.current && particlesRef.current.geometry && elapsedTime >= 0) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        const sizes = particlesRef.current.geometry.attributes.size.array;
        const colors = particlesRef.current.geometry.attributes.color.array;

        // Recreate curve for diagonal path
        const curve = new THREE.QuadraticBezierCurve3(startPos, controlPoint, endPos);

        for (let i = 0; i < particleCount; i++) {
          const point = metadataRef.current[i];
          if (!point) continue;
          const idx = i * 3;

          // Calculate animation progress (0 to 1)
          // Particles start after their delay and move along the diagonal
          const animProgress = Math.max(0, Math.min(1, (elapsedTime - point.startDelay) / 4.0));
          
          // Get base position along diagonal curve
          const basePoint = curve.getPoint(animProgress);

          // Calculate horizontal wobble using sine wave
          // Wave frequency determines how many waves across the path
          const waveTime = elapsedTime * point.frequency;
          const horizontalWobble = Math.sin(waveTime + point.phase) * point.amplitude;
          
          // Add vertical wave component for more organic movement
          const verticalWobble = Math.cos(waveTime * 0.7 + point.phase) * point.amplitude * 0.5;

          // Apply position with wave wobble
          // Move diagonally while wobbling horizontally
          positions[idx] = basePoint.x + horizontalWobble;
          positions[idx + 1] = basePoint.y + verticalWobble;
          positions[idx + 2] = basePoint.z;

          // Size pulsing
          const sizePulseSpeed = point.layerType === 'core' ? 0.4 : 
                                (point.layerType === 'middle' ? 0.2 : 0.1);
          const sizePulseAmount = 0.15;
          const ageFactor = Math.sin(elapsedTime * sizePulseSpeed + point.phase * 2);
          sizes[i] = point.size * (1 + sizePulseAmount * ageFactor);

          // Color pulsing
          const colorIdx = i * 3;
          const colorPulse = Math.sin(elapsedTime * 0.2 + point.phase) * 0.1 + 0.9;
          colors[colorIdx] = point.originalColor.r * colorPulse;
          colors[colorIdx + 1] = point.originalColor.g * colorPulse;
          colors[colorIdx + 2] = point.originalColor.b * colorPulse;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.geometry.attributes.size.needsUpdate = true;
        particlesRef.current.geometry.attributes.color.needsUpdate = true;
      }
    });

    return (
      <points ref={particlesRef} geometry={geometry} material={material} />
    );
  };

  export default CurvedParticles;
