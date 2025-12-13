import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GalaxyParticles = ({ moonPosition = [0, 1, 0], scrollProgress = 0 }) => {
  const particlesRef = useRef();
  const timeRef = useRef(0);
  const metadataRef = useRef([]);

  // Create 7 galaxy clusters around the moon
  const { geometry, material } = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];
    const metadata = [];

    const numClusters = 7;
    const particlesPerCluster = 80;

    for (let cluster = 0; cluster < numClusters; cluster++) {
      // Position each cluster in orbit around the moon
      const orbitAngle = (cluster / numClusters) * Math.PI * 2;
      const orbitRadius = 2.5;
      const orbitHeight = Math.sin(orbitAngle * 1.5) * 0.8;

      // Cluster center position (orbit around moon)
      const clusterCenterX = Math.cos(orbitAngle) * orbitRadius + moonPosition[0];
      const clusterCenterY = orbitHeight + moonPosition[1];
      const clusterCenterZ = Math.sin(orbitAngle) * orbitRadius + moonPosition[2];

      // Wave destination for this cluster (when scrolling)
      const waveAngle = orbitAngle + Math.PI * 0.3;
      const waveDistance = 15;
      const waveDestX = Math.cos(waveAngle) * waveDistance;
      const waveDestY = -5 + Math.sin(cluster * 0.5) * 3;
      const waveDestZ = Math.sin(waveAngle) * waveDistance;

      // Create particles within this cluster
      for (let i = 0; i < particlesPerCluster; i++) {
        // Random position within cluster (spherical distribution)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const clusterSpread = 0.3 + Math.random() * 0.4;

        const localX = Math.sin(phi) * Math.cos(theta) * clusterSpread;
        const localY = Math.sin(phi) * Math.sin(theta) * clusterSpread;
        const localZ = Math.cos(phi) * clusterSpread;

        // Initial position (in orbit)
        const x = clusterCenterX + localX;
        const y = clusterCenterY + localY;
        const z = clusterCenterZ + localZ;

        positions.push(x, y, z);

        // Galaxy colors (warm to cool gradient per cluster)
        const color = new THREE.Color();
        const clusterHue = cluster / numClusters;
        
        if (clusterHue < 0.3) {
          // Warm colors (golden/orange)
          const warmth = 0.8 + Math.random() * 0.2;
          color.setRGB(warmth, warmth * 0.7, warmth * 0.4);
        } else if (clusterHue < 0.6) {
          // Mid colors (yellow/white)
          const mid = 0.75 + Math.random() * 0.25;
          color.setRGB(mid, mid * 0.9, mid * 0.7);
        } else {
          // Cool colors (blue/white)
          const cool = 0.7 + Math.random() * 0.3;
          color.setRGB(cool * 0.7, cool * 0.85, cool);
        }

        colors.push(color.r, color.g, color.b);

        // Variable sizes
        const size = 0.015 + Math.random() * 0.06;
        sizes.push(size);

        // Store metadata for animation
        metadata.push({
          // Orbit position (initial state)
          orbitX: x,
          orbitY: y,
          orbitZ: z,
          
          // Wave destination (scroll state)
          waveDestX: waveDestX,
          waveDestY: waveDestY,
          waveDestZ: waveDestZ,
          
          // Cluster info
          clusterIndex: cluster,
          clusterCenterX: clusterCenterX,
          clusterCenterY: clusterCenterY,
          clusterCenterZ: clusterCenterZ,
          
          // Animation properties
          orbitSpeed: 0.3 + Math.random() * 0.4,
          orbitRadius: Math.sqrt(localX * localX + localY * localY + localZ * localZ),
          orbitAngle: Math.atan2(localZ, localX),
          orbitPhase: Math.random() * Math.PI * 2,
          
          // Wave properties
          waveFrequency: 0.5 + Math.random() * 0.3,
          waveAmplitude: 0.4 + Math.random() * 0.3,
          wavePhase: Math.random() * Math.PI * 2,
          
          size: size,
          originalColor: { r: color.r, g: color.g, b: color.b }
        });
      }
    }

    metadataRef.current = metadata;

    // Create geometry
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Shader material (same style as MoonParticles)
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

    return { geometry: geom, material: mat };
  }, [moonPosition]);

  // Animate based on scroll
  useFrame((state, delta) => {
    timeRef.current += delta;
    const time = timeRef.current;

    if (particlesRef.current && particlesRef.current.geometry) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const sizes = particlesRef.current.geometry.attributes.size.array;
      const colors = particlesRef.current.geometry.attributes.color.array;

      for (let i = 0; i < metadataRef.current.length; i++) {
        const point = metadataRef.current[i];
        const idx = i * 3;

        // Orbital motion (when scrollProgress = 0)
        const orbitTime = time * point.orbitSpeed;
        const currentOrbitAngle = point.orbitAngle + orbitTime;
        
        const orbitX = point.clusterCenterX + Math.cos(currentOrbitAngle) * point.orbitRadius;
        const orbitY = point.clusterCenterY + Math.sin(orbitTime * 0.5 + point.orbitPhase) * point.orbitRadius * 0.3;
        const orbitZ = point.clusterCenterZ + Math.sin(currentOrbitAngle) * point.orbitRadius;

        // Wave motion (when scrollProgress > 0)
        const waveTime = time * point.waveFrequency;
        const waveOffsetX = Math.sin(waveTime + point.wavePhase) * point.waveAmplitude;
        const waveOffsetY = Math.cos(waveTime * 0.7 + point.wavePhase) * point.waveAmplitude * 0.5;
        const waveOffsetZ = Math.sin(waveTime * 0.8 + point.wavePhase) * point.waveAmplitude * 0.3;

        const waveX = point.waveDestX + waveOffsetX;
        const waveY = point.waveDestY + waveOffsetY;
        const waveZ = point.waveDestZ + waveOffsetZ;

        // Interpolate between orbit and wave based on scrollProgress
        // Use easing for smooth transition
        const easedProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress); // smoothstep

        positions[idx] = orbitX + (waveX - orbitX) * easedProgress;
        positions[idx + 1] = orbitY + (waveY - orbitY) * easedProgress;
        positions[idx + 2] = orbitZ + (waveZ - orbitZ) * easedProgress;

        // Size pulsing (more intense during wave state)
        const sizePulse = Math.sin(time * 0.5 + point.wavePhase) * 0.15;
        const sizeMultiplier = 1 + sizePulse * (1 + scrollProgress * 0.5);
        sizes[i] = point.size * sizeMultiplier;

        // Color pulsing
        const colorIdx = i * 3;
        const colorPulse = Math.sin(time * 0.3 + point.wavePhase) * 0.1 + 0.9;
        const colorIntensity = colorPulse * (1 + scrollProgress * 0.2);
        
        colors[colorIdx] = point.originalColor.r * colorIntensity;
        colors[colorIdx + 1] = point.originalColor.g * colorIntensity;
        colors[colorIdx + 2] = point.originalColor.b * colorIntensity;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.size.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return <points ref={particlesRef} geometry={geometry} material={material} />;
};

export default GalaxyParticles;