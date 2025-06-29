'use client';

import React from 'react';

export default function EnhancedSentimentDisplay({ sentimentData }) {
  if (!sentimentData || !sentimentData.sentiment) {
    return null;
  }

  const { userSentiment } = sentimentData.sentiment;
  
  // Extract enhancement data
  const emotions = userSentiment.emotions;
  const sarcasm = userSentiment.sarcasm;
  const intent = userSentiment.intent;
  const subjectivity = userSentiment.subjectivity;
  const visuals = userSentiment.visuals;

  return (
    <div className="sentiment-card animate-fade-in-up">
      <h3 className="sentiment-header animate-fade-in-down">Enhanced Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Basic Sentiment */}
        <div className="bg-auto-secondary rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-auto animate-bounce-in delay-100">
          <h4 className="font-display font-medium text-auto mb-3 animate-fade-in-left">Sentiment</h4>
          <div className="flex items-center gap-3">
            {visuals?.sentiment && (
              <span className="text-3xl animate-bounce">{visuals.sentiment.emoji}</span>
            )}
            <div className="animate-fade-in-right delay-200">
              <div className="sentiment-value text-auto">
                Score: {userSentiment.score.toFixed(2)}
              </div>
              <div className="sentiment-label">
                {userSentiment.description}
              </div>
            </div>
          </div>
        </div>

        {/* Emotion Detection */}
        {emotions && emotions.primary !== 'neutral' && (
          <div className="bg-auto-secondary rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-auto animate-bounce-in delay-200">
            <h4 className="font-display font-medium text-auto mb-3 animate-fade-in-left">Emotion</h4>
            <div className="flex items-center gap-3">
              {visuals?.emotion && (
                <span className="text-3xl animate-heartbeat">{visuals.emotion.emoji}</span>
              )}
              <div className="animate-fade-in-right delay-300">
                <div className="sentiment-value capitalize text-auto">
                  {emotions.primary}
                </div>
                <div className="sentiment-label">
                  Confidence: {(emotions.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Intent Classification */}
        {intent && intent.primary !== 'statement' && (
          <div className="bg-auto-secondary rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-auto animate-bounce-in delay-300">
            <h4 className="font-display font-medium text-auto mb-3 animate-fade-in-left">Intent</h4>
            <div className="flex items-center gap-3">
              {visuals?.intent && (
                <span className="text-3xl animate-wiggle">{visuals.intent.emoji}</span>
              )}
              <div className="animate-fade-in-right delay-400">
                <div className="sentiment-value capitalize text-auto">
                  {intent.primary}
                </div>
                <div className="sentiment-label">
                  Confidence: {(intent.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sarcasm Detection */}
        {sarcasm && sarcasm.isSarcastic && (
          <div className="bg-auto-secondary rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-auto animate-shake delay-400">
            <h4 className="font-display font-medium text-auto mb-3 animate-fade-in-left">Sarcasm Detected</h4>
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-wiggle">😏</span>
              <div className="animate-fade-in-right delay-500">
                <div className="sentiment-value text-auto">
                  Sarcastic
                </div>
                <div className="sentiment-label">
                  Confidence: {(sarcasm.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            {sarcasm.indicators && sarcasm.indicators.length > 0 && (
              <div className="mt-3 animate-fade-in-up delay-600">
                <div className="font-body font-medium text-xs text-auto-secondary mb-1">Indicators:</div>
                <ul className="list-disc list-inside text-xs text-auto-secondary space-y-1">
                  {sarcasm.indicators.slice(0, 2).map((indicator, index) => (
                    <li key={index} className="font-body stagger-item">{indicator}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Subjectivity Analysis */}
        {subjectivity && (
          <div className="bg-auto-secondary rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-auto animate-bounce-in delay-500">
            <h4 className="font-display font-medium text-auto mb-3 animate-fade-in-left">Subjectivity</h4>
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-float">
                {subjectivity.isSubjective ? '💭' : '📊'}
              </span>
              <div className="animate-fade-in-right delay-600">
                <div className="sentiment-value text-auto">
                  {subjectivity.isSubjective ? 'Subjective' : 'Objective'}
                </div>
                <div className="sentiment-label">
                  Confidence: {(subjectivity.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            {subjectivity.indicators && subjectivity.indicators.length > 0 && (
              <div className="mt-3 animate-fade-in-up delay-700">
                <div className="font-body font-medium text-xs text-auto-secondary mb-1">Indicators:</div>
                <ul className="list-disc list-inside text-xs text-auto-secondary space-y-1">
                  {subjectivity.indicators.slice(0, 2).map((indicator, index) => (
                    <li key={index} className="font-body stagger-item">{indicator}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Visual Summary */}
        {visuals && (
          <div className="bg-auto-secondary rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-auto animate-bounce-in delay-600">
            <h4 className="font-display font-medium text-auto mb-3 animate-fade-in-left">Visual Summary</h4>
            <div className="flex gap-2 flex-wrap">
              {visuals.emotion && (
                <span 
                  className="emotion-indicator px-3 py-2 rounded-full text-xs font-display font-medium shadow-sm hover:scale-110 transition-all duration-200 animate-fade-in-up delay-700"
                  style={{ backgroundColor: visuals.emotion.color + '20', color: visuals.emotion.color }}
                >
                  {visuals.emotion.emoji} {visuals.emotion.tag}
                </span>
              )}
              {visuals.sentiment && (
                <span 
                  className="emotion-indicator px-3 py-2 rounded-full text-xs font-display font-medium shadow-sm hover:scale-110 transition-all duration-200 animate-fade-in-up delay-800"
                  style={{ backgroundColor: visuals.sentiment.color + '20', color: visuals.sentiment.color }}
                >
                  {visuals.sentiment.emoji} {visuals.sentiment.tag}
                </span>
              )}
              {visuals.intent && (
                <span 
                  className="emotion-indicator px-3 py-2 rounded-full text-xs font-display font-medium shadow-sm hover:scale-110 transition-all duration-200 animate-fade-in-up delay-900"
                  style={{ backgroundColor: visuals.intent.color + '20', color: visuals.intent.color }}
                >
                  {visuals.intent.emoji} {visuals.intent.tag}
                </span>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Detailed Breakdown */}
      <div className="mt-6 pt-6 border-t border-auto animate-fade-in-up delay-1000">
        <h4 className="font-display font-medium text-auto mb-4 animate-fade-in-down">Detailed Breakdown</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sentiment Details */}
          <div className="bg-auto-secondary rounded-lg p-4 border border-auto transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in-left delay-1100">
            <h5 className="font-display font-medium text-auto-secondary mb-3 animate-fade-in-up">Sentiment Analysis</h5>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between animate-fade-in-right delay-1200">
                <span className="text-auto-secondary">Score:</span>
                <span className="font-mono font-medium text-auto">{userSentiment.score}</span>
              </div>
              <div className="flex justify-between animate-fade-in-right delay-1300">
                <span className="text-auto-secondary">Comparative:</span>
                <span className="font-mono font-medium text-auto">{userSentiment.comparative?.toFixed(3)}</span>
              </div>
              {userSentiment.positive && userSentiment.positive.length > 0 && (
                <div className="animate-fade-in-right delay-1400">
                  <span className="text-auto-secondary">Positive words:</span>
                  <div className="font-body text-auto mt-1">
                    {userSentiment.positive.join(', ')}
                  </div>
                </div>
              )}
              {userSentiment.negative && userSentiment.negative.length > 0 && (
                <div className="animate-fade-in-right delay-1500">
                  <span className="text-auto-secondary">Negative words:</span>
                  <div className="font-body text-auto mt-1">
                    {userSentiment.negative.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emotion Details */}
          {emotions && (
            <div className="bg-auto-secondary rounded-lg p-4 border border-auto transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in-right delay-1100">
              <h5 className="font-display font-medium text-auto-secondary mb-3 animate-fade-in-up">Emotion Breakdown</h5>
              <div className="space-y-2 text-sm font-body">
                {Object.entries(emotions.emotions).map(([emotion, score], index) => (
                  <div key={emotion} className="flex justify-between items-center animate-fade-in-left" style={{ animationDelay: `${1200 + index * 100}ms` }}>
                    <span className="text-auto-secondary capitalize">{emotion}:</span>
                    <div className="flex items-center gap-2">
                      <div className="confidence-bar w-16">
                        <div 
                          className="confidence-fill" 
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>
                      <span className="font-mono font-medium text-auto text-xs">
                        {(score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
} 