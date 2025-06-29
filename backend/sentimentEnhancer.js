// Enhanced Sentiment Analysis Module
// This module provides additional NLP capabilities beyond basic sentiment analysis
// To disable any feature, set the corresponding ENABLE_* environment variable to false

const natural = require('natural');

// Configuration - can be controlled via environment variables
const CONFIG = {
  ENABLE_EMOTION_DETECTION: process.env.ENABLE_EMOTION_DETECTION !== 'false',
  ENABLE_SARCASTIC_DETECTION: process.env.ENABLE_SARCASTIC_DETECTION !== 'false',
  ENABLE_INTENT_CLASSIFICATION: process.env.ENABLE_INTENT_CLASSIFICATION !== 'false',
  ENABLE_SUBJECTIVITY_ANALYSIS: process.env.ENABLE_SUBJECTIVITY_ANALYSIS !== 'false',
  ENABLE_VISUAL_OUTPUTS: process.env.ENABLE_VISUAL_OUTPUTS !== 'false'
};

// Enhanced emotion lexicon with more granular emotions
const EMOTION_LEXICON = {
  joy: ['happy', 'joy', 'excited', 'delighted', 'thrilled', 'ecstatic', 'elated', 'jubilant', 'cheerful', 'gleeful'],
  anger: ['angry', 'furious', 'enraged', 'irritated', 'annoyed', 'mad', 'livid', 'outraged', 'fuming', 'seething'],
  sadness: ['sad', 'depressed', 'melancholy', 'sorrowful', 'grief', 'despair', 'hopeless', 'miserable', 'heartbroken'],
  fear: ['afraid', 'scared', 'terrified', 'frightened', 'panicked', 'anxious', 'worried', 'nervous', 'apprehensive'],
  surprise: ['surprised', 'shocked', 'astonished', 'amazed', 'stunned', 'bewildered', 'perplexed', 'confused'],
  disgust: ['disgusted', 'revolted', 'repulsed', 'appalled', 'horrified', 'sickened', 'nauseated'],
  trust: ['trust', 'confident', 'secure', 'assured', 'reliable', 'faithful', 'loyal'],
  anticipation: ['excited', 'eager', 'enthusiastic', 'optimistic', 'hopeful', 'expectant', 'curious']
};

// Sarcasm indicators
const SARCASTIC_INDICATORS = {
  punctuation: ['!', '...', '??', '?!', '!?'],
  phrases: ['oh great', 'wonderful', 'fantastic', 'brilliant', 'genius', 'obviously', 'clearly', 'sure'],
  patterns: ['yeah right', 'oh really', 'is that so', 'no way', 'whatever', 'sure thing'],
  capitalization: ['REALLY', 'WOW', 'AMAZING', 'GREAT', 'FANTASTIC']
};

// Intent classification patterns
const INTENT_PATTERNS = {
  question: {
    patterns: ['what', 'how', 'why', 'when', 'where', 'who', 'which', '?'],
    keywords: ['explain', 'tell me', 'describe', 'clarify', 'understand']
  },
  command: {
    patterns: ['do this', 'make', 'create', 'build', 'send', 'call', 'go', 'stop', 'start'],
    keywords: ['please', 'need', 'want', 'require', 'demand']
  },
  complaint: {
    patterns: ['problem', 'issue', 'broken', 'wrong', 'bad', 'terrible', 'awful', 'hate', 'dislike'],
    keywords: ['not working', 'doesn\'t work', 'failed', 'error', 'bug']
  },
  greeting: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    keywords: ['greetings', 'welcome', 'nice to meet']
  },
  gratitude: {
    patterns: ['thank', 'thanks', 'appreciate', 'grateful', 'blessed'],
    keywords: ['helpful', 'useful', 'great job', 'well done']
  },
  apology: {
    patterns: ['sorry', 'apologize', 'regret', 'mistake', 'wrong'],
    keywords: ['my bad', 'my fault', 'forgive', 'excuse']
  }
};

// Subjectivity indicators
const SUBJECTIVITY_INDICATORS = {
  opinion: ['think', 'believe', 'feel', 'opinion', 'view', 'perspective', 'seems', 'appears', 'looks like'],
  factual: ['fact', 'data', 'statistics', 'research', 'study', 'evidence', 'proven', 'confirmed'],
  subjective_verbs: ['love', 'hate', 'like', 'dislike', 'prefer', 'enjoy', 'despise', 'adore'],
  objective_verbs: ['is', 'are', 'was', 'were', 'has', 'have', 'had', 'does', 'do', 'did']
};

// Visual output mappings
const VISUAL_OUTPUTS = {
  emotions: {
    joy: { emoji: '😊', color: '#4CAF50', tag: 'JOY' },
    anger: { emoji: '😠', color: '#F44336', tag: 'ANGER' },
    sadness: { emoji: '😢', color: '#2196F3', tag: 'SADNESS' },
    fear: { emoji: '😨', color: '#9C27B0', tag: 'FEAR' },
    surprise: { emoji: '😲', color: '#FF9800', tag: 'SURPRISE' },
    disgust: { emoji: '🤢', color: '#795548', tag: 'DISGUST' },
    trust: { emoji: '🤝', color: '#4CAF50', tag: 'TRUST' },
    anticipation: { emoji: '🤞', color: '#FFC107', tag: 'ANTICIPATION' },
    neutral: { emoji: '😐', color: '#9E9E9E', tag: 'NEUTRAL' }
  },
  sentiment: {
    positive: { emoji: '👍', color: '#4CAF50', tag: 'POSITIVE' },
    negative: { emoji: '👎', color: '#F44336', tag: 'NEGATIVE' },
    neutral: { emoji: '🤷', color: '#9E9E9E', tag: 'NEUTRAL' }
  },
  intent: {
    question: { emoji: '❓', color: '#2196F3', tag: 'QUESTION' },
    command: { emoji: '⚡', color: '#FF9800', tag: 'COMMAND' },
    complaint: { emoji: '⚠️', color: '#F44336', tag: 'COMPLAINT' },
    greeting: { emoji: '👋', color: '#4CAF50', tag: 'GREETING' },
    gratitude: { emoji: '🙏', color: '#4CAF50', tag: 'GRATITUDE' },
    apology: { emoji: '🙇', color: '#2196F3', tag: 'APOLOGY' }
  }
};

/**
 * Enhanced emotion detection using lexicon-based approach
 * @param {string} text - Input text to analyze
 * @returns {Object} Emotion analysis results
 */
function detectEmotions(text) {
  if (!CONFIG.ENABLE_EMOTION_DETECTION) {
    return { primary: 'neutral', confidence: 0, emotions: {} };
  }

  const lowerText = text.toLowerCase();
  const emotionScores = {};
  let totalMatches = 0;

  // Count emotion keyword matches
  for (const [emotion, keywords] of Object.entries(EMOTION_LEXICON)) {
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
    emotionScores[emotion] = matches;
    totalMatches += matches;
  }

  // Find primary emotion
  let primaryEmotion = 'neutral';
  let maxScore = 0;

  for (const [emotion, score] of Object.entries(emotionScores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryEmotion = emotion;
    }
  }

  const confidence = totalMatches > 0 ? maxScore / totalMatches : 0;

  return {
    primary: primaryEmotion,
    confidence: confidence,
    emotions: emotionScores
  };
}

/**
 * Sarcasm detection using multiple indicators
 * @param {string} text - Input text to analyze
 * @returns {Object} Sarcasm detection results
 */
function detectSarcasm(text) {
  if (!CONFIG.ENABLE_SARCASTIC_DETECTION) {
    return { isSarcastic: false, confidence: 0, indicators: [] };
  }

  const indicators = [];
  let sarcasmScore = 0;
  const maxScore = 5; // Normalize to 0-1 scale

  // Check punctuation patterns
  const punctuationCount = SARCASTIC_INDICATORS.punctuation.filter(p => text.includes(p)).length;
  if (punctuationCount > 0) {
    indicators.push(`Excessive punctuation (${punctuationCount})`);
    sarcasmScore += Math.min(punctuationCount, 2);
  }

  // Check sarcastic phrases
  const sarcasticPhrases = SARCASTIC_INDICATORS.phrases.filter(phrase => 
    text.toLowerCase().includes(phrase)
  );
  if (sarcasticPhrases.length > 0) {
    indicators.push(`Sarcastic phrases: ${sarcasticPhrases.join(', ')}`);
    sarcasmScore += sarcasticPhrases.length;
  }

  // Check sarcastic patterns
  const sarcasticPatterns = SARCASTIC_INDICATORS.patterns.filter(pattern => 
    text.toLowerCase().includes(pattern)
  );
  if (sarcasticPatterns.length > 0) {
    indicators.push(`Sarcastic patterns: ${sarcasticPatterns.join(', ')}`);
    sarcasmScore += sarcasticPatterns.length;
  }

  // Check excessive capitalization
  const words = text.split(' ');
  const capitalizedWords = words.filter(word => 
    word.length > 2 && word === word.toUpperCase() && 
    SARCASTIC_INDICATORS.capitalization.includes(word)
  );
  if (capitalizedWords.length > 0) {
    indicators.push(`Excessive capitalization: ${capitalizedWords.join(', ')}`);
    sarcasmScore += capitalizedWords.length;
  }

  const confidence = Math.min(sarcasmScore / maxScore, 1);
  const isSarcastic = confidence > 0.3; // Threshold for sarcasm detection

  return {
    isSarcastic,
    confidence,
    indicators
  };
}

/**
 * Intent classification using pattern matching
 * @param {string} text - Input text to analyze
 * @returns {Object} Intent classification results
 */
function classifyIntent(text) {
  if (!CONFIG.ENABLE_INTENT_CLASSIFICATION) {
    return { primary: 'statement', confidence: 0, intents: {} };
  }

  const lowerText = text.toLowerCase();
  const intentScores = {};

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;

    // Check pattern matches
    for (const pattern of patterns.patterns) {
      if (lowerText.includes(pattern)) {
        score += 2; // Higher weight for pattern matches
      }
    }

    // Check keyword matches
    for (const keyword of patterns.keywords) {
      if (lowerText.includes(keyword)) {
        score += 1;
      }
    }

    intentScores[intent] = score;
  }

  // Find primary intent
  let primaryIntent = 'statement';
  let maxScore = 0;

  for (const [intent, score] of Object.entries(intentScores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryIntent = intent;
    }
  }

  const confidence = maxScore > 0 ? maxScore / (maxScore + 1) : 0;

  return {
    primary: primaryIntent,
    confidence,
    intents: intentScores
  };
}

/**
 * Subjectivity analysis to distinguish opinions from facts
 * @param {string} text - Input text to analyze
 * @returns {Object} Subjectivity analysis results
 */
function analyzeSubjectivity(text) {
  if (!CONFIG.ENABLE_SUBJECTIVITY_ANALYSIS) {
    return { isSubjective: false, confidence: 0, indicators: [] };
  }

  const lowerText = text.toLowerCase();
  const indicators = [];
  let subjectivityScore = 0;
  const maxScore = 10;

  // Check opinion indicators
  const opinionMatches = SUBJECTIVITY_INDICATORS.opinion.filter(indicator => 
    lowerText.includes(indicator)
  );
  if (opinionMatches.length > 0) {
    indicators.push(`Opinion words: ${opinionMatches.join(', ')}`);
    subjectivityScore += opinionMatches.length * 2;
  }

  // Check subjective verbs
  const subjectiveVerbMatches = SUBJECTIVITY_INDICATORS.subjective_verbs.filter(verb => 
    lowerText.includes(verb)
  );
  if (subjectiveVerbMatches.length > 0) {
    indicators.push(`Subjective verbs: ${subjectiveVerbMatches.join(', ')}`);
    subjectivityScore += subjectiveVerbMatches.length;
  }

  // Check factual indicators (reduce subjectivity)
  const factualMatches = SUBJECTIVITY_INDICATORS.factual.filter(indicator => 
    lowerText.includes(indicator)
  );
  if (factualMatches.length > 0) {
    indicators.push(`Factual indicators: ${factualMatches.join(', ')}`);
    subjectivityScore = Math.max(0, subjectivityScore - factualMatches.length);
  }

  const confidence = Math.min(subjectivityScore / maxScore, 1);
  const isSubjective = confidence > 0.3;

  return {
    isSubjective,
    confidence,
    indicators
  };
}

/**
 * Generate visual outputs for the analysis results
 * @param {Object} analysis - Complete analysis results
 * @returns {Object} Visual output mappings
 */
function generateVisualOutputs(analysis) {
  if (!CONFIG.ENABLE_VISUAL_OUTPUTS) {
    return {};
  }

  const visuals = {};

  // Emotion visual
  if (analysis.emotions) {
    const emotion = analysis.emotions.primary || 'neutral';
    visuals.emotion = VISUAL_OUTPUTS.emotions[emotion] || VISUAL_OUTPUTS.emotions.neutral;
  }

  // Sentiment visual
  if (analysis.sentiment) {
    const sentiment = analysis.sentiment.score > 0 ? 'positive' : 
                     analysis.sentiment.score < 0 ? 'negative' : 'neutral';
    visuals.sentiment = VISUAL_OUTPUTS.sentiment[sentiment];
  }

  // Intent visual
  if (analysis.intent) {
    const intent = analysis.intent.primary || 'statement';
    visuals.intent = VISUAL_OUTPUTS.intent[intent] || { emoji: '💬', color: '#9E9E9E', tag: 'STATEMENT' };
  }

  return visuals;
}

/**
 * Main enhanced analysis function that combines all features
 * @param {string} text - Input text to analyze
 * @param {Object} baseSentiment - Base sentiment analysis results
 * @returns {Object} Enhanced analysis results
 */
function enhanceSentimentAnalysis(text, baseSentiment) {
  const enhanced = {
    ...baseSentiment,
    enhancements: {
      enabled: {
        emotionDetection: CONFIG.ENABLE_EMOTION_DETECTION,
        sarcasmDetection: CONFIG.ENABLE_SARCASTIC_DETECTION,
        intentClassification: CONFIG.ENABLE_INTENT_CLASSIFICATION,
        subjectivityAnalysis: CONFIG.ENABLE_SUBJECTIVITY_ANALYSIS,
        visualOutputs: CONFIG.ENABLE_VISUAL_OUTPUTS
      }
    }
  };

  // Add emotion detection
  if (CONFIG.ENABLE_EMOTION_DETECTION) {
    enhanced.emotions = detectEmotions(text);
  }

  // Add sarcasm detection
  if (CONFIG.ENABLE_SARCASTIC_DETECTION) {
    enhanced.sarcasm = detectSarcasm(text);
  }

  // Add intent classification
  if (CONFIG.ENABLE_INTENT_CLASSIFICATION) {
    enhanced.intent = classifyIntent(text);
  }

  // Add subjectivity analysis
  if (CONFIG.ENABLE_SUBJECTIVITY_ANALYSIS) {
    enhanced.subjectivity = analyzeSubjectivity(text);
  }

  // Add visual outputs
  if (CONFIG.ENABLE_VISUAL_OUTPUTS) {
    enhanced.visuals = generateVisualOutputs(enhanced);
  }

  return enhanced;
}

module.exports = {
  enhanceSentimentAnalysis,
  detectEmotions,
  detectSarcasm,
  classifyIntent,
  analyzeSubjectivity,
  generateVisualOutputs,
  CONFIG
}; 