'use client';

// Check if we're running in the browser and get the current hostname
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If we're on localhost, use the backend port
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3003';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
};

/**
 * Send a message to the AI and get a response
 * @param {string} message - The user's message
 * @param {Array} history - Previous conversation history
 * @returns {Promise<Object>} - The AI's response with emotion data
 */
export async function sendMessage(message, history = []) {
  try {
    const API_URL = getApiUrl();
    console.log('Sending message to API:', message);
    console.log('API URL:', API_URL);
    
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
      body: JSON.stringify({
        message,
        history: formattedHistory
      }),
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Return a fallback response when the backend is unavailable
    if (error.name === 'AbortError') {
      console.error('Request timeout');
      return {
        response: "Request timed out. The backend server might be busy or unavailable.",
        emotion: "neutral"
      };
    }
    
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      console.error('Connection error');
      const backendUrl = getApiUrl();
      return {
        response: `I'm having trouble connecting to the backend server at ${backendUrl}. Please make sure it's running and accessible from your browser.`,
        emotion: "neutral"
      };
    }
    
    return {
      response: "Sorry, I encountered an error processing your request: " + error.message,
      emotion: "sad"
    };
  }
} 