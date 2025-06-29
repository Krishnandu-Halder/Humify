'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ChatInterface({ onMessage, onSpeakingChange }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Speech recognition setup
  const recognition = useRef(null);
  const speechSynthesis = useRef(null);
  
  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = typeof window !== 'undefined' ? 
      window.SpeechRecognition || window.webkitSpeechRecognition : null;
    
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';
      
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript);
      };
      
      recognition.current.onend = () => {
        setIsListening(false);
      };
      
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Show a message if permission is denied
        if (event.error === 'not-allowed') {
          setMessages(prev => [...prev, { 
            role: 'system', 
            content: 'Microphone access was denied. Please enable microphone permissions to use voice input.' 
          }]);
        }
      };
      
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }
    
    // Check if text-to-speech is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
      setTtsSupported(true);
      
      // Get available voices
      const getVoices = () => {
        const voices = speechSynthesis.current.getVoices();
        console.log('Available TTS voices:', voices);
      };
      
      if (speechSynthesis.current.onvoiceschanged !== undefined) {
        speechSynthesis.current.onvoiceschanged = getVoices;
      }
      
      getVoices();
    } else {
      setTtsSupported(false);
      console.warn('Text-to-speech not supported in this browser');
    }
    
    // Clean up
    return () => {
      if (recognition.current) {
        try {
          recognition.current.stop();
        } catch (e) {
          // Ignore errors when stopping recognition
        }
      }
      
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, []);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const toggleListening = () => {
    if (isListening) {
      try {
        recognition.current?.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
      setIsListening(false);
    } else if (recognition.current) {
      try {
        recognition.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: 'Failed to start speech recognition. Please try again.' 
        }]);
      }
    }
  };
  
  const speakText = (text) => {
    if (!ttsSupported || !speechSynthesis.current) return false;
    
    try {
      // Cancel any ongoing speech
      speechSynthesis.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices and try to select a good one
      const voices = speechSynthesis.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang === 'en-US' && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang === 'en-US') || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      if (onSpeakingChange) {
        onSpeakingChange(true);
        utterance.onend = () => onSpeakingChange(false);
        utterance.onerror = () => onSpeakingChange(false);
      }
      
      speechSynthesis.current.speak(utterance);
      return true;
    } catch (speechError) {
      console.error('Text-to-speech error:', speechError);
      if (onSpeakingChange) onSpeakingChange(false);
      return false;
    }
  };
  
  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return;
    
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Notify parent component about the message
      if (onMessage) {
        const response = await onMessage(text, messages);
        
        // Add the response to the messages
        const assistantMessage = { role: 'assistant', content: response.response };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Use text-to-speech for the response
        speakText(response.response);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
      
      if (onSpeakingChange) onSpeakingChange(false);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[500px] w-full bg-auto-secondary rounded-lg overflow-hidden shadow-md border border-auto animate-fade-in-up">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-auto-secondary mt-8 animate-fade-in-up">
            <div className="mb-4 animate-float">
              <span className="text-4xl">💬</span>
            </div>
            <p className="font-body animate-fade-in-up delay-200">Start a conversation with Humify</p>
            <p className="text-sm mt-2 font-body animate-fade-in-up delay-300">Try asking a question or saying hello</p>
            <div className="mt-4 flex justify-center space-x-2 animate-fade-in-up delay-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping-slow"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping-slow delay-200"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping-slow delay-400"></div>
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-4 p-3 rounded-lg max-w-[80%] font-body transition-all duration-300 hover:scale-[1.02] ${
              msg.role === 'user' 
                ? 'ml-auto bg-auto-accent text-auto-inverse shadow-md animate-slide-in-right hover-glow' 
                : msg.role === 'system'
                ? 'mx-auto bg-auto-tertiary text-auto-secondary text-center text-sm animate-fade-in-up'
                : 'mr-auto bg-auto text-auto border border-auto animate-slide-in-left hover-lift'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {msg.content}
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-center gap-2 text-auto-secondary animate-fade-in-up">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
            <span className="text-sm font-body animate-pulse">Humify is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-auto bg-auto animate-fade-in-up delay-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 input"
            disabled={isProcessing}
          />
          
          {speechSupported && (
            <button
              onClick={toggleListening}
              disabled={isProcessing}
              className={`btn ripple ${isListening ? 'btn-error animate-pulse-glow' : 'btn-secondary hover-rotate'} min-w-[44px] h-[44px] p-0 flex items-center justify-center`}
            >
              {isListening ? (
                <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
          
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isProcessing}
            className="btn btn-primary ripple min-w-[44px] h-[44px] p-0 flex items-center justify-center hover-bounce"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-auto-secondary animate-fade-in-up delay-500">
          <div className="flex items-center gap-4">
            {speechSupported && (
              <span className="flex items-center gap-1 hover-lift">
                <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                Voice input available
              </span>
            )}
            {ttsSupported && (
              <span className="flex items-center gap-1 hover-lift">
                <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.207a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Voice output available
              </span>
            )}
          </div>
          <span className="font-mono animate-fade-in-up delay-700">{messages.length} messages</span>
        </div>
      </div>
    </div>
  );
} 