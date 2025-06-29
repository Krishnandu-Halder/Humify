// Lip-sync service for real-time audio analysis
export class LipSyncService {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.isRunning = false;
    this.callbacks = new Set();
  }

  // Initialize audio context and analyzer
  async initialize() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize lip-sync service:', error);
      return false;
    }
  }

  // Start analyzing audio from microphone
  async startMicrophoneAnalysis() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
      
      this.isRunning = true;
      this.analyzeAudio();
      
      return stream;
    } catch (error) {
      console.error('Failed to start microphone analysis:', error);
      throw error;
    }
  }

  // Start analyzing audio from audio element
  startAudioAnalysis(audioElement) {
    try {
      const source = this.audioContext.createMediaElementSource(audioElement);
      source.connect(this.analyser);
      source.connect(this.audioContext.destination); // Reconnect to speakers
      
      this.isRunning = true;
      this.analyzeAudio();
    } catch (error) {
      console.error('Failed to start audio analysis:', error);
      throw error;
    }
  }

  // Analyze audio and extract mouth movement data
  analyzeAudio() {
    if (!this.isRunning) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Calculate audio level in speech frequency range (85-255 Hz)
    const speechRange = this.dataArray.slice(2, 8); // Roughly 85-255 Hz
    const averageLevel = speechRange.reduce((sum, value) => sum + value, 0) / speechRange.length;
    
    // Normalize to 0-1 range
    const normalizedLevel = Math.min(averageLevel / 128, 1);
    
    // Apply smoothing and threshold
    const smoothedLevel = this.applySmoothing(normalizedLevel);
    const thresholdedLevel = this.applyThreshold(smoothedLevel);
    
    // Notify callbacks
    this.callbacks.forEach(callback => {
      callback({
        level: thresholdedLevel,
        rawLevel: normalizedLevel,
        timestamp: Date.now()
      });
    });

    requestAnimationFrame(() => this.analyzeAudio());
  }

  // Apply smoothing to reduce jitter
  applySmoothing(level) {
    if (!this.lastLevel) {
      this.lastLevel = level;
      return level;
    }
    
    const smoothingFactor = 0.3;
    this.lastLevel = this.lastLevel * (1 - smoothingFactor) + level * smoothingFactor;
    return this.lastLevel;
  }

  // Apply threshold to detect speech vs silence
  applyThreshold(level) {
    const threshold = 0.1;
    const boost = 2.0;
    
    if (level < threshold) {
      return 0;
    }
    
    return Math.min((level - threshold) * boost, 1);
  }

  // Get current audio level
  getCurrentLevel() {
    if (!this.dataArray) return 0;
    
    const speechRange = this.dataArray.slice(2, 8);
    const averageLevel = speechRange.reduce((sum, value) => sum + value, 0) / speechRange.length;
    return Math.min(averageLevel / 128, 1);
  }

  // Subscribe to lip-sync updates
  subscribe(callback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  // Stop analysis
  stop() {
    this.isRunning = false;
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  // Generate fake lip-sync data for testing
  generateFakeLipSyncData(text, duration = 3000) {
    const words = text.split(' ');
    const wordDuration = duration / words.length;
    const data = [];
    
    words.forEach((word, index) => {
      const startTime = index * wordDuration;
      const endTime = (index + 1) * wordDuration;
      
      // Generate mouth movements for each word
      const syllables = this.estimateSyllables(word);
      const syllableDuration = wordDuration / syllables;
      
      for (let i = 0; i < syllables; i++) {
        const syllableStart = startTime + i * syllableDuration;
        const syllableEnd = syllableStart + syllableDuration;
        
        // Add mouth open/close cycle for each syllable
        data.push({
          time: syllableStart,
          level: 0.8,
          type: 'open'
        });
        data.push({
          time: syllableStart + syllableDuration * 0.3,
          level: 0.2,
          type: 'close'
        });
      }
    });
    
    return data;
  }

  // Estimate number of syllables in a word
  estimateSyllables(word) {
    return Math.max(1, Math.floor(word.length / 3));
  }
}

// Export a singleton instance
export const lipSyncService = new LipSyncService(); 