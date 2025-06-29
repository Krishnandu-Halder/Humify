'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { sendMessage } from '../services/api';
import ChatInterface from './ChatInterface';
import FallbackAvatar from './FallbackAvatar';
import EnhancedSentimentDisplay from './EnhancedSentimentDisplay';

// Dynamically import the 3D components with no SSR and error handling
const AvatarScene = dynamic(
  () => import('./AvatarScene').catch(() => {
    console.error('Failed to load AvatarScene component');
    return () => null;
  }),
  { 
    ssr: false,
    loading: () => <div className="h-[500px] w-full flex items-center justify-center bg-gray-100">
      <p>Loading 3D avatar...</p>
    </div>
  }
);

export default function AvatarContainer() {
  const [emotion, setEmotion] = useState('neutral');
  const [speaking, setSpeaking] = useState(false);
  const [use3D, setUse3D] = useState(true);
  const [sentimentData, setSentimentData] = useState(null);
  const [showEnhancedAnalysis, setShowEnhancedAnalysis] = useState(true);
  
  // Check if WebGL is supported
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, falling back to 2D avatar');
        setUse3D(false);
      }
    } catch (e) {
      console.error('Error checking WebGL support:', e);
      setUse3D(false);
    }
  }, []);

  const handleMessage = async (message, history) => {
    try {
      const response = await sendMessage(message, history);
      
      // Update the avatar's emotion based on the AI response
      if (response.emotion) {
        setEmotion(response.emotion);
      }
      
      // Store sentiment data if available
      if (response.sentiment) {
        setSentimentData(response.sentiment);
      }
      
      return response;
    } catch (error) {
      console.error('Error in handleMessage:', error);
      return { response: 'Sorry, I encountered an error. Please try again.' };
    }
  };
  
  // Get sentiment color based on score
  const getSentimentColor = (score) => {
    if (score > 2) return 'text-green-600';
    if (score > 0) return 'text-green-500';
    if (score > -2) return 'text-yellow-600';
    if (score > -5) return 'text-orange-600';
    return 'text-red-600';
  };
  
  // Get sentiment label
  const getSentimentLabel = (score) => {
    if (score > 2) return 'Very Positive';
    if (score > 0) return 'Positive';
    if (score > -2) return 'Neutral';
    if (score > -5) return 'Negative';
    return 'Very Negative';
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto p-4">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Your AI Avatar</h2>
        
        <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
          {use3D ? (
            <AvatarScene 
              emotion={emotion} 
              speaking={speaking}
            />
          ) : (
            <FallbackAvatar emotion={emotion} speaking={speaking} />
          )}
        </div>
        
        {/* Avatar status and basic sentiment analysis */}
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-600">
            <p><strong>Avatar State:</strong></p>
            <p>• Emotion: <span className="font-semibold capitalize">{emotion}</span></p>
            <p>• Speaking: <span className="font-semibold">{speaking ? 'Yes' : 'No'}</span></p>
          </div>
          
          {sentimentData && (
            <div className="text-sm bg-white p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">Basic Sentiment Analysis:</p>
                <button
                  onClick={() => setShowEnhancedAnalysis(!showEnhancedAnalysis)}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  {showEnhancedAnalysis ? 'Hide' : 'Show'} Enhanced
                </button>
              </div>
              <div className="space-y-1">
                <p>• User Sentiment: 
                  <span className={`font-semibold ml-1 ${getSentimentColor(sentimentData.score)}`}>
                    {getSentimentLabel(sentimentData.score)}
                  </span>
                </p>
                <p>• Sentiment Score: 
                  <span className={`font-mono ml-1 ${getSentimentColor(sentimentData.score)}`}>
                    {sentimentData.score.toFixed(2)}
                  </span>
                </p>
                <p>• Detected Emotion: 
                  <span className="font-semibold ml-1 capitalize text-blue-600">
                    {sentimentData.userSentiment?.emotion || 'neutral'}
                  </span>
                </p>
                {sentimentData.userSentiment?.positive?.length > 0 && (
                  <p>• Positive Words: 
                    <span className="text-green-600 ml-1">
                      {sentimentData.userSentiment.positive.join(', ')}
                    </span>
                  </p>
                )}
                {sentimentData.userSentiment?.negative?.length > 0 && (
                  <p>• Negative Words: 
                    <span className="text-red-600 ml-1">
                      {sentimentData.userSentiment.negative.join(', ')}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Chat with AI</h2>
        <ChatInterface 
          onMessage={handleMessage}
          onSpeakingChange={setSpeaking}
        />
        
        {/* Enhanced Sentiment Analysis Display */}
        {showEnhancedAnalysis && sentimentData && (
          <EnhancedSentimentDisplay sentimentData={sentimentData} />
        )}
      </div>
    </div>
  );
} 