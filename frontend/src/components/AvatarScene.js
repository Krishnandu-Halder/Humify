'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import Avatar3D from './Avatar3D';

export default function AvatarScene({ emotion = 'neutral', speaking = false }) {
  const [errorLoading, setErrorLoading] = useState(false);

  // Error boundary for Three.js
  useEffect(() => {
    const handleError = (event) => {
      console.error('Three.js error:', event.error);
      setErrorLoading(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (errorLoading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-500 font-bold">Failed to load 3D avatar</p>
          <p className="mt-2">Your browser might not support WebGL or 3D rendering</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Transparent background
        }}
        onError={(e) => {
          console.error('Canvas error:', e);
          setErrorLoading(true);
        }}
      >
        <color attach="background" args={['#f0f0f0']} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        <Suspense fallback={null}>
          <Avatar3D emotion={emotion} speaking={speaking} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
            resolution={256}
          />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
} 