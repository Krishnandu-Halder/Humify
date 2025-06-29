'use client';

import React from 'react';

export default function FallbackAvatar({ emotion = 'neutral', speaking = false }) {
  // Simple emoji-based fallback for when 3D rendering fails
  const getEmoji = () => {
    switch (emotion) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'angry':
        return '😠';
      case 'surprised':
        return '😲';
      default:
        return '😐';
    }
  };

  return (
    <div className="h-[500px] w-full flex flex-col items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-9xl animate-pulse" style={{ animationDuration: speaking ? '0.5s' : '2s' }}>
        {getEmoji()}
      </div>
      <p className="mt-6 text-lg text-gray-700">
        {speaking ? 'Speaking...' : 'Ready to chat!'}
      </p>
      <p className="mt-4 text-sm text-gray-500">
        (Fallback avatar - 3D rendering unavailable)
      </p>
    </div>
  );
} 