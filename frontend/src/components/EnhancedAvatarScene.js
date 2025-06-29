'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PerspectiveCamera,
  SpotLight,
  PointLight,
  useHelper
} from '@react-three/drei';
import * as THREE from 'three';
import EnhancedAvatar3D from './EnhancedAvatar3D';

// Lighting component for better avatar illumination
function AvatarLighting() {
  const spotLightRef = useRef();
  const pointLightRef = useRef();
  
  // Add helper for debugging (remove in production)
  // useHelper(spotLightRef, THREE.SpotLightHelper, 'red');
  
  return (
    <>
      {/* Main spotlight for avatar */}
      <SpotLight
        ref={spotLightRef}
        position={[0, 5, 5]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-near={0.1}
        color="#ffffff"
      />
      
      {/* Fill light */}
      <PointLight
        ref={pointLightRef}
        position={[-3, 2, 3]}
        intensity={0.3}
        color="#ffffff"
      />
      
      {/* Rim light for depth */}
      <PointLight
        position={[3, 1, -2]}
        intensity={0.2}
        color="#ffffff"
      />
      
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} />
    </>
  );
}

export default function EnhancedAvatarScene({ 
  emotion = 'neutral', 
  speaking = false,
  readyPlayerMeUrl = null,
  lipSyncData = null,
  avatarType = 'geometric'
}) {
  const [errorLoading, setErrorLoading] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([0, 0, 5]);

  // Error boundary for Three.js
  useEffect(() => {
    const handleError = (event) => {
      console.error('Three.js error:', event.error);
      setErrorLoading(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Adjust camera based on avatar type
  useEffect(() => {
    if (avatarType === 'readyplayerme') {
      setCameraPosition([0, 0, 3]); // Closer for detailed avatars
    } else {
      setCameraPosition([0, 0, 5]); // Further for geometric avatars
    }
  }, [avatarType]);

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
        camera={{ 
          position: cameraPosition, 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        shadows
        gl={{ 
          preserveDrawingBuffer: true, 
          alpha: true,
          antialias: true,
          shadowMap: true,
          shadowMapType: THREE.PCFSoftShadowMap
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0); // Transparent background
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          
          // Set up scene
          scene.fog = new THREE.Fog(0xf0f0f0, 1, 20);
        }}
        onError={(e) => {
          console.error('Canvas error:', e);
          setErrorLoading(true);
        }}
      >
        {/* Background gradient */}
        <color attach="background" args={['#f8fafc']} />
        
        {/* Enhanced lighting */}
        <AvatarLighting />
        
        {/* Environment for reflections */}
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
        
        {/* Enhanced avatar */}
        <Suspense fallback={
          <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
        }>
          <EnhancedAvatar3D 
            emotion={emotion} 
            speaking={speaking}
            readyPlayerMeUrl={readyPlayerMeUrl}
            lipSyncData={lipSyncData}
          />
        </Suspense>
        
        {/* Enhanced shadows */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.6}
          scale={10}
          blur={3}
          far={4}
          resolution={512}
          color="#000000"
        />
        
        {/* Camera controls */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 1.5}
          rotateSpeed={0.5}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
        
        {/* Grid for reference (optional) */}
        {process.env.NODE_ENV === 'development' && (
          <gridHelper args={[10, 10, '#cccccc', '#cccccc']} />
        )}
      </Canvas>
      
      {/* Loading overlay */}
      {avatarType === 'loading' && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4">Loading Ready Player Me Avatar...</p>
          </div>
        </div>
      )}
    </div>
  );
} 