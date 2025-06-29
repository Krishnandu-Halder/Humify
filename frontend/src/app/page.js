'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';

// Use dynamic import with error boundary
const AvatarContainer = dynamic(
  () => import('../components/AvatarContainer').catch(() => {
    // Return a simple component if the import fails
    return () => (
      <div className="p-8 text-center animate-bounce-in">
        <h2 className="text-2xl font-display font-bold text-red-500 animate-shake">Failed to load Humify</h2>
        <p className="mt-4 font-body text-auto-secondary animate-fade-in-up delay-200">
          There was an error loading the application. Please try refreshing the page.
        </p>
      </div>
    );
  }),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center animate-fade-in-up">
          <div className="loading-spinner text-auto-accent" />
          <p className="mt-4 font-body text-auto-secondary animate-pulse">Loading Humify...</p>
          <div className="loading-dots mt-4">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-auto py-12">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-display font-bold text-auto mb-4 tracking-tight animate-fade-in-down hover-glow">
          Humify
        </h1>
        <p className="text-xl font-body text-auto-secondary max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Your AI companion with enhanced emotional intelligence
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <div className="badge badge-success animate-bounce-in delay-300">
            <span className="animate-pulse">🤖</span> AI-Powered
          </div>
          <div className="badge badge-info animate-bounce-in delay-400">
            <span className="animate-heartbeat">💭</span> Emotional Intelligence
          </div>
          <div className="badge badge-warning animate-bounce-in delay-500">
            <span className="animate-float">🎭</span> 3D Avatar
          </div>
        </div>
      </header>
      
      {isLoaded ? (
        <Suspense fallback={
          <div className="text-center p-12 animate-fade-in-up">
            <div className="loading-spinner text-auto-accent" />
            <p className="mt-4 font-body text-auto-secondary animate-pulse">Loading components...</p>
            <div className="loading-dots mt-4">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        }>
          <div className="animate-scale-in delay-300">
            <AvatarContainer />
          </div>
        </Suspense>
      ) : (
        <div className="text-center p-12 animate-fade-in-up">
          <div className="loading-pulse mx-auto" />
          <p className="mt-4 font-body text-auto-secondary animate-pulse">Initializing application...</p>
        </div>
      )}
      
      <footer className="mt-20 text-center text-auto-muted text-sm font-body animate-fade-in-up delay-700">
        <p className="hover-lift">Powered by Next.js, Three.js, and OpenAI</p>
        <p className="mt-2 animate-fade-in-up delay-800">
          <strong>Note:</strong> Make sure the backend server is running at http://localhost:3003
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping-slow"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping-slow delay-200"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping-slow delay-400"></div>
        </div>
        <div className="mt-6 animate-fade-in-up delay-900">
          <Link 
            href="/demo" 
            className="btn btn-secondary hover-lift inline-flex items-center gap-2"
          >
            <span className="animate-pulse">✨</span>
            View Animation Demo
            <span className="animate-bounce">→</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
