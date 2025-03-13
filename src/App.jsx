import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';
import MoonParticles from './components/MoonParticles/MoonParticles';
import Navbar from './components/Navbar/Navbar'; // Import the Navbar componen


export default function App() {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-black overflow-hidden">
            {/* Add the Navbar component */}
            <Navbar />
            
            <Canvas className="w-full h-full" camera={{ position: [0, 0, 7], fov: 45 }} shadows>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                    <MoonParticles />
                    <EffectComposer>
                        <Bloom 
                            intensity={1.2}
                            luminanceThreshold={0.1}
                            luminanceSmoothing={0.9}
                            kernelSize={2}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}