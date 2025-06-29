'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// This is a placeholder for a real 3D model
// In production, you would use a proper 3D model with facial animations
export default function Avatar3D({ emotion = 'neutral', speaking = false }) {
  const group = useRef();
  const [mouthOpen, setMouthOpen] = useState(false);
  
  // Simulate mouth movement when speaking
  useEffect(() => {
    if (speaking) {
      const interval = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      setMouthOpen(false);
    }
  }, [speaking]);
  
  // Animation logic based on emotion and speaking state
  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Simple head movement to simulate life-like behavior
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    
    // Subtle body movement
    if (group.current.position) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  // Get color based on emotion
  const getEmotionColor = () => {
    switch(emotion) {
      case 'happy': return '#FFD700';
      case 'sad': return '#6495ED';
      case 'angry': return '#FF6347';
      case 'surprised': return '#9370DB';
      case 'excited': return '#FF69B4';
      default: return '#CCCCCC';
    }
  };

  return (
    <group ref={group}>
      {/* Head */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={getEmotionColor()} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.3, 0.2, 0.9]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh position={[-0.3, 0.2, 0.9]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
      
      {/* Eyebrows - change based on emotion */}
      <mesh position={[0.3, 0.4, 0.9]} rotation={[0, 0, emotion === 'angry' ? -0.5 : emotion === 'surprised' ? 0.3 : 0]}>
        <boxGeometry args={[0.25, 0.05, 0.05]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh position={[-0.3, 0.4, 0.9]} rotation={[0, 0, emotion === 'angry' ? 0.5 : emotion === 'surprised' ? -0.3 : 0]}>
        <boxGeometry args={[0.25, 0.05, 0.05]} />
        <meshBasicMaterial color="black" />
      </mesh>
      
      {/* Mouth - changes based on speaking state and emotion */}
      <mesh 
        position={[0, -0.2, 0.9]} 
        scale={[
          1, 
          mouthOpen ? 2 : emotion === 'happy' ? 1.5 : emotion === 'surprised' ? 2 : 1, 
          1
        ]}
      >
        <capsuleGeometry args={[0.2, mouthOpen ? 0.2 : emotion === 'happy' ? 0.1 : emotion === 'sad' ? -0.1 : 0.05, 8, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
    </group>
  );
}

// In a real implementation, you would load a GLTF model like this:
/*
export function AvatarWithModel({ emotion = 'neutral', speaking = false }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/avatar.glb');
  const { actions } = useAnimations(animations, group);
  
  useEffect(() => {
    // Play animation based on emotion
    if (emotion === 'happy') {
      actions.happy?.play();
    } else if (emotion === 'sad') {
      actions.sad?.play();
    }
    // etc.
  }, [emotion, actions]);
  
  return <primitive object={scene} ref={group} />;
}
*/ 