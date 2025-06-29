'use client';

import React, { useState } from 'react';

export default function AnimationDemo() {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="p-8 bg-auto-secondary rounded-xl shadow-lg border border-auto animate-fade-in-up">
      <h2 className="text-3xl font-display font-bold text-auto mb-6 animate-fade-in-down">
        Animation Showcase
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Fade Animations */}
        <div className="card animate-fade-in-up delay-100">
          <h3 className="text-xl font-display font-semibold text-auto mb-4">Fade Animations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded animate-fade-in">Fade In</div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded animate-fade-in-up">Fade In Up</div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded animate-fade-in-down">Fade In Down</div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded animate-fade-in-left">Fade In Left</div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded animate-fade-in-right">Fade In Right</div>
          </div>
        </div>

        {/* Slide Animations */}
        <div className="card animate-fade-in-up delay-200">
          <h3 className="text-xl font-display font-semibold text-auto mb-4">Slide Animations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded animate-slide-in-up">Slide In Up</div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded animate-slide-in-down">Slide In Down</div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded animate-slide-in-left">Slide In Left</div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded animate-slide-in-right">Slide In Right</div>
          </div>
        </div>

        {/* Scale Animations */}
        <div className="card animate-fade-in-up delay-300">
          <h3 className="text-xl font-display font-semibold text-auto mb-4">Scale Animations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded animate-scale-in">Scale In</div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded animate-zoom-in">Zoom In</div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded animate-bounce-in">Bounce In</div>
          </div>
        </div>

        {/* Special Effects */}
        <div className="card animate-fade-in-up delay-400">
          <h3 className="text-xl font-display font-semibold text-auto mb-4">Special Effects</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded animate-shimmer">Shimmer</div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded animate-pulse-glow">Pulse Glow</div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded animate-float">Float</div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded animate-wiggle">Wiggle</div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded animate-shake">Shake</div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="card animate-fade-in-up delay-500">
          <h3 className="text-xl font-display font-semibold text-auto mb-4">Interactive Elements</h3>
          <div className="space-y-3">
            <button className="btn btn-primary ripple w-full">Ripple Button</button>
            <button className="btn btn-secondary hover-lift w-full">Hover Lift</button>
            <button className="btn btn-secondary hover-glow w-full">Hover Glow</button>
            <button className="btn btn-secondary hover-rotate w-full">Hover Rotate</button>
            <button className="btn btn-secondary hover-bounce w-full">Hover Bounce</button>
          </div>
        </div>

        {/* Loading Animations */}
        <div className="card animate-fade-in-up delay-600">
          <h3 className="text-xl font-display font-semibold text-auto mb-4">Loading Animations</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="loading-spinner"></div>
              <span className="text-sm">Spinner</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="loading-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
              <span className="text-sm">Dots</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="loading-pulse"></div>
              <span className="text-sm">Pulse</span>
            </div>
          </div>
        </div>

        {/* Emoji Animations */}
        <div className="card animate-fade-in-up delay-700">
          <h3 className="text-xl font-display font-semibold text-auto mb-4">Emoji Animations</h3>
          <div className="space-y-3 text-center">
            <div className="text-4xl animate-bounce">🎉</div>
            <div className="text-4xl animate-heartbeat">❤️</div>
            <div className="text-4xl animate-wiggle">🎭</div>
            <div className="text-4xl animate-float">🦋</div>
            <div className="text-4xl animate-shake">🌋</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="card animate-fade-in-up delay-800">
          <h3 className="text-xl font-display font-semibold text-auto mb-4">Progress Animations</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-auto-secondary mb-2">Loading...</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ '--progress-width': '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-auto-secondary mb-2">Confidence</div>
              <div className="confidence-bar">
                <div className="confidence-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stagger List */}
        <div className="card animate-fade-in-up delay-900">
          <h3 className="text-xl font-display font-semibold text-auto mb-4">Stagger List</h3>
          <div className="space-y-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded stagger-item">Item 1</div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded stagger-item">Item 2</div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded stagger-item">Item 3</div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded stagger-item">Item 4</div>
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded stagger-item">Item 5</div>
          </div>
        </div>

      </div>

      {/* Continuous Animations */}
      <div className="mt-8 p-6 bg-gradient-bg rounded-xl animate-fade-in-up delay-1000">
        <h3 className="text-2xl font-display font-semibold text-white mb-4 text-center">Continuous Animations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="text-3xl animate-pulse-slow">⚡</div>
          <div className="text-3xl animate-spin-slow">🌀</div>
          <div className="text-3xl animate-ping-slow">💫</div>
          <div className="text-3xl animate-bounce-slow">🎾</div>
        </div>
      </div>

      {/* Animation Controls */}
      <div className="mt-8 p-6 bg-auto rounded-xl animate-fade-in-up delay-1100">
        <h3 className="text-2xl font-display font-semibold text-auto mb-4">Animation Utilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-auto-secondary rounded text-center">
            <div className="font-mono">delay-100</div>
            <div className="text-auto-secondary">100ms delay</div>
          </div>
          <div className="p-3 bg-auto-secondary rounded text-center">
            <div className="font-mono">delay-500</div>
            <div className="text-auto-secondary">500ms delay</div>
          </div>
          <div className="p-3 bg-auto-secondary rounded text-center">
            <div className="font-mono">duration-fast</div>
            <div className="text-auto-secondary">150ms duration</div>
          </div>
          <div className="p-3 bg-auto-secondary rounded text-center">
            <div className="font-mono">duration-slow</div>
            <div className="text-auto-secondary">500ms duration</div>
          </div>
        </div>
      </div>
    </div>
  );
} 