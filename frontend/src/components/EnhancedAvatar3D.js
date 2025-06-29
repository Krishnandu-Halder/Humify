'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EnhancedAvatar3D({ 
  emotion = 'neutral', 
  speaking = false
}) {
  const group = useRef();
  const headRef = useRef();
  const eyesRef = useRef();
  const mouthRef = useRef();
  const eyebrowsRef = useRef();
  
  const [mouthOpen, setMouthOpen] = useState(0);
  const [eyeBlink, setEyeBlink] = useState(0);
  const [headRotation, setHeadRotation] = useState({ x: 0, y: 0, z: 0 });
  
  // Enhanced emotion-based facial expressions
  const emotionConfig = useMemo(() => ({
    neutral: {
      mouthOpen: 0,
      browPosition: 0,
      eyeWideness: 1,
      headTilt: 0,
      color: '#f5d0c5',
      eyeColor: '#4a5568',
      hairColor: '#2d3748'
    },
    happy: {
      mouthOpen: 0.4,
      browPosition: 0.3,
      eyeWideness: 1.3,
      headTilt: 0.1,
      color: '#fed7aa',
      eyeColor: '#38a169',
      hairColor: '#2d3748'
    },
    sad: {
      mouthOpen: -0.2,
      browPosition: -0.4,
      eyeWideness: 0.7,
      headTilt: -0.05,
      color: '#90cdf4',
      eyeColor: '#3182ce',
      hairColor: '#2d3748'
    },
    angry: {
      mouthOpen: -0.3,
      browPosition: -0.6,
      eyeWideness: 0.6,
      headTilt: 0.05,
      color: '#feb2b2',
      eyeColor: '#e53e3e',
      hairColor: '#2d3748'
    },
    surprised: {
      mouthOpen: 0.7,
      browPosition: 0.5,
      eyeWideness: 1.6,
      headTilt: 0,
      color: '#d6bcfa',
      eyeColor: '#805ad5',
      hairColor: '#2d3748'
    },
    excited: {
      mouthOpen: 0.5,
      browPosition: 0.4,
      eyeWideness: 1.4,
      headTilt: 0.15,
      color: '#fbb6ce',
      eyeColor: '#d53f8c',
      hairColor: '#2d3748'
    }
  }), []);

  // Enhanced lip sync animation
  useEffect(() => {
    if (speaking) {
      const interval = setInterval(() => {
        setMouthOpen(prev => prev === 0 ? 0.5 : 0);
      }, 120);
      return () => clearInterval(interval);
    } else {
      setMouthOpen(emotionConfig[emotion]?.mouthOpen || 0);
    }
  }, [speaking, emotion, emotionConfig]);

  // Natural blinking with variation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(1);
      setTimeout(() => setEyeBlink(0), 120);
    }, 2500 + Math.random() * 3000);
    
    return () => clearInterval(blinkInterval);
  }, []);

  // Enhanced head movement and breathing
  useFrame((state, delta) => {
    if (!group.current) return;
    
    const time = state.clock.elapsedTime;
    const emotionData = emotionConfig[emotion] || emotionConfig.neutral;
    
    // More natural head movement
    const headMovement = {
      x: Math.sin(time * 0.25) * 0.015 + emotionData.headTilt,
      y: Math.sin(time * 0.15) * 0.02,
      z: Math.cos(time * 0.3) * 0.008
    };
    
    setHeadRotation(headMovement);
    
    // Subtle breathing effect
    const breathing = Math.sin(time * 0.6) * 0.015;
    group.current.position.y = breathing;
    
    // Update facial features with smooth transitions
    if (mouthRef.current) {
      mouthRef.current.scale.y = 1 + mouthOpen * 0.6;
    }
    
    if (eyesRef.current) {
      eyesRef.current.scale.y = 1 - eyeBlink * 0.9;
      eyesRef.current.scale.x = emotionData.eyeWideness;
    }
    
    if (eyebrowsRef.current) {
      eyebrowsRef.current.position.y = 0.4 + emotionData.browPosition * 0.25;
    }
  });

  return (
    <group ref={group}>
      {/* Enhanced Head with better geometry */}
      <mesh ref={headRef} rotation={[headRotation.x, headRotation.y, headRotation.z]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color={emotionConfig[emotion]?.color || '#f5d0c5'}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>
      
      {/* Enhanced Eyes with better detail */}
      <group ref={eyesRef} position={[0, 0.2, 0.9]}>
        {/* Left Eye */}
        <group position={[0.3, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={emotionConfig[emotion]?.eyeColor || '#4a5568'} />
          </mesh>
          <mesh position={[0.02, 0.02, 0.12]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
        
        {/* Right Eye */}
        <group position={[-0.3, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={emotionConfig[emotion]?.eyeColor || '#4a5568'} />
          </mesh>
          <mesh position={[0.02, 0.02, 0.12]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
      
      {/* Enhanced Eyebrows */}
      <group ref={eyebrowsRef} position={[0, 0.4, 0.9]}>
        <mesh 
          position={[0.3, 0, 0]} 
          rotation={[0, 0, emotion === 'angry' ? -0.4 : emotion === 'surprised' ? 0.3 : 0]}
        >
          <boxGeometry args={[0.35, 0.06, 0.04]} />
          <meshStandardMaterial color={emotionConfig[emotion]?.hairColor || '#2d3748'} roughness={0.8} />
        </mesh>
        <mesh 
          position={[-0.3, 0, 0]} 
          rotation={[0, 0, emotion === 'angry' ? 0.4 : emotion === 'surprised' ? -0.3 : 0]}
        >
          <boxGeometry args={[0.35, 0.06, 0.04]} />
          <meshStandardMaterial color={emotionConfig[emotion]?.hairColor || '#2d3748'} roughness={0.8} />
        </mesh>
      </group>
      
      {/* Enhanced Mouth with better anatomy */}
      <group ref={mouthRef} position={[0, -0.2, 0.9]}>
        {/* Upper lip */}
        <mesh position={[0, 0.08, 0]}>
          <capsuleGeometry args={[0.28, 0.08, 12, 20]} />
          <meshStandardMaterial color="#e53e3e" roughness={0.3} />
        </mesh>
        
        {/* Lower lip */}
        <mesh position={[0, -0.08, 0]}>
          <capsuleGeometry args={[0.28, 0.08, 12, 20]} />
          <meshStandardMaterial color="#e53e3e" roughness={0.3} />
        </mesh>
        
        {/* Mouth opening */}
        {mouthOpen > 0.1 && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, mouthOpen * 0.4, 20]} />
            <meshStandardMaterial color="#000000" roughness={0.9} />
          </mesh>
        )}
      </group>
      
      {/* Enhanced Nose */}
      <mesh position={[0, 0, 1.15]}>
        <coneGeometry args={[0.09, 0.35, 12]} />
        <meshStandardMaterial color="#fbb6ce" roughness={0.4} />
      </mesh>
      
      {/* Enhanced Hair with better styling */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[1.15, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
        <meshStandardMaterial 
          color={emotionConfig[emotion]?.hairColor || '#2d3748'} 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Ears */}
      <mesh position={[0.85, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI, 0, Math.PI]} />
        <meshStandardMaterial color="#f5d0c5" roughness={0.3} />
      </mesh>
      <mesh position={[-0.85, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI, 0, Math.PI]} />
        <meshStandardMaterial color="#f5d0c5" roughness={0.3} />
      </mesh>
    </group>
  );
} 