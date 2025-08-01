
import React, { Suspense } from 'react';
// Import the React instance from our provider to ensure consistency
import { React as ProviderReact } from './ReactLayoutProvider';
import { Canvas } from '@react-three/fiber';

// This component safely wraps React Three Fiber elements
const ReactThreeWrapper = ({ children, ...props }) => {
  return (
    <Suspense fallback={<div>Loading 3D elements...</div>}>
      <Canvas {...props}>
        {children}
      </Canvas>
    </Suspense>
  );
};

// Export using the same React instance
export default ProviderReact.memo(ReactThreeWrapper);