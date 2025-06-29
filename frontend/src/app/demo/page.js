'use client';

import dynamic from 'next/dynamic';

const AnimationDemo = dynamic(() => import('../../components/AnimationDemo'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center animate-fade-in-up">
        <div className="loading-spinner text-auto-accent" />
        <p className="mt-4 font-body text-auto-secondary animate-pulse">Loading Animation Demo...</p>
      </div>
    </div>
  )
});

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-auto py-12">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-12 text-center animate-fade-in-down">
          <h1 className="text-5xl font-display font-bold text-auto mb-4 tracking-tight hover-glow">
            Animation Showcase
          </h1>
          <p className="text-xl font-body text-auto-secondary max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Explore the comprehensive collection of CSS animations and interactive effects 
            that bring Humify to life with engaging visual feedback and smooth transitions.
          </p>
          <div className="mt-6 flex justify-center space-x-4 animate-fade-in-up delay-300">
            <div className="badge badge-success animate-bounce-in delay-400">
              <span className="animate-pulse">✨</span> 25+ Animations
            </div>
            <div className="badge badge-info animate-bounce-in delay-500">
              <span className="animate-heartbeat">🎭</span> Interactive
            </div>
            <div className="badge badge-warning animate-bounce-in delay-600">
              <span className="animate-float">🎨</span> Beautiful
            </div>
          </div>
        </header>
        
        <AnimationDemo />
        
        <footer className="mt-20 text-center text-auto-muted text-sm font-body animate-fade-in-up delay-1200">
          <p className="hover-lift">All animations are optimized for performance and accessibility</p>
          <p className="mt-2 animate-fade-in-up delay-1300">
            <strong>Features:</strong> Smooth transitions, hover effects, loading states, and more!
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping-slow"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping-slow delay-200"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping-slow delay-400"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping-slow delay-600"></div>
          </div>
        </footer>
      </div>
    </div>
  );
} 