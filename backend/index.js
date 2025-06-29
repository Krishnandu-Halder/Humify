const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const Sentiment = require('sentiment');
const { enhanceSentimentAnalysis, CONFIG } = require('./sentimentEnhancer');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3003;

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  credentials: false
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Human Avatar API is running',
    enhancements: {
      enabled: CONFIG,
      features: [
        'Enhanced emotion detection',
        'Sarcasm detection',
        'Intent classification',
        'Subjectivity analysis',
        'Visual outputs'
      ]
    }
  });
});

// New endpoint to test enhancements
app.post('/api/test-enhancements', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Get base sentiment
    const baseSentiment = sentiment.analyze(message);
    
    // Apply enhancements
    const enhanced = enhanceSentimentAnalysis(message, baseSentiment);
    
    res.json({
      original: baseSentiment,
      enhanced: enhanced,
      configuration: CONFIG
    });
  } catch (error) {
    console.error('Error testing enhancements:', error);
    res.status(500).json({ error: 'Failed to test enhancements', details: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Get base sentiment analysis
    const baseSentiment = sentiment.analyze(message);
    
    // Apply enhanced sentiment analysis
    const userSentiment = enhanceSentimentAnalysis(message, baseSentiment);
    console.log('Enhanced user sentiment analysis:', userSentiment);
    
    const messages = [
      ...history,
      { role: "user", content: message }
    ];
    
    // Create enhanced system message that considers all analysis results
    const systemMessage = createEnhancedSystemMessage(userSentiment);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [systemMessage, ...messages],
      max_tokens: 300,
      temperature: 0.7
    });
    
    const aiResponse = completion.choices[0].message.content;
    
    // Determine the avatar's emotion based on enhanced analysis
    const avatarEmotion = determineEnhancedAvatarEmotion(userSentiment, aiResponse);
    
    const response = {
      response: aiResponse,
      emotion: avatarEmotion,
      sentiment: {
        userSentiment: userSentiment,
        score: userSentiment.score,
        comparative: userSentiment.comparative
      }
    };
    
    console.log('Sending enhanced response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
});

/**
 * Create enhanced system message based on all analysis results
 * @param {Object} userSentiment - Enhanced sentiment analysis results
 * @returns {Object} System message for OpenAI
 */
function createEnhancedSystemMessage(userSentiment) {
  let context = `The user's message has been analyzed and shows: ${userSentiment.description}.`;
  
  // Add emotion context
  if (userSentiment.emotions && userSentiment.emotions.primary !== 'neutral') {
    context += ` The user appears to be feeling ${userSentiment.emotions.primary} (confidence: ${(userSentiment.emotions.confidence * 100).toFixed(1)}%).`;
  }
  
  // Add sarcasm context
  if (userSentiment.sarcasm && userSentiment.sarcasm.isSarcastic) {
    context += ` The message appears to be sarcastic (confidence: ${(userSentiment.sarcasm.confidence * 100).toFixed(1)}%).`;
  }
  
  // Add intent context
  if (userSentiment.intent && userSentiment.intent.primary !== 'statement') {
    context += ` The user's intent appears to be a ${userSentiment.intent.primary} (confidence: ${(userSentiment.intent.confidence * 100).toFixed(1)}%).`;
  }
  
  // Add subjectivity context
  if (userSentiment.subjectivity) {
    const subjectivityType = userSentiment.subjectivity.isSubjective ? 'subjective opinion' : 'objective statement';
    context += ` The message is a ${subjectivityType} (confidence: ${(userSentiment.subjectivity.confidence * 100).toFixed(1)}%).`;
  }
  
  return {
    role: "system",
    content: `You are a helpful AI assistant with an emotional avatar. ${context}
    
    Respond appropriately based on the analysis:
    - If the user is being sarcastic: Acknowledge the sarcasm with humor or understanding
    - If the user is asking a question: Provide a clear, helpful answer
    - If the user is making a complaint: Be empathetic and offer solutions
    - If the user is expressing gratitude: Show appreciation and warmth
    - If the user is apologizing: Be forgiving and supportive
    - If the user is giving a command: Acknowledge and respond appropriately
    - If the user is greeting: Respond warmly and ask how you can help
    
    Match the emotional context:
    - Joy/Excitement: Be enthusiastic and positive
    - Anger/Frustration: Be calm, understanding, and solution-oriented
    - Sadness/Depression: Be empathetic and supportive
    - Fear/Anxiety: Be reassuring and helpful
    - Surprise/Confusion: Be clear and explanatory
    - Disgust: Be understanding and offer alternatives
    - Trust: Be reliable and professional
    - Anticipation: Be encouraging and informative
    
    Keep your response natural and conversational.`
  };
}

/**
 * Enhanced avatar emotion determination using all analysis results
 * @param {Object} userSentiment - Enhanced sentiment analysis results
 * @param {string} aiResponse - AI's response text
 * @returns {string} Avatar emotion
 */
function determineEnhancedAvatarEmotion(userSentiment, aiResponse) {
  // Analyze AI response sentiment
  const aiSentiment = sentiment.analyze(aiResponse);
  
  // Start with base sentiment combination
  let combinedScore = userSentiment.score + (aiSentiment.score * 0.5);
  
  // Adjust based on detected emotions
  if (userSentiment.emotions && userSentiment.emotions.primary !== 'neutral') {
    const emotionAdjustments = {
      joy: 2,
      anger: -2,
      sadness: -1,
      fear: -1,
      surprise: 0,
      disgust: -2,
      trust: 1,
      anticipation: 1
    };
    
    const adjustment = emotionAdjustments[userSentiment.emotions.primary] || 0;
    combinedScore += adjustment * userSentiment.emotions.confidence;
  }
  
  // Adjust for sarcasm (reduce intensity)
  if (userSentiment.sarcasm && userSentiment.sarcasm.isSarcastic) {
    combinedScore *= 0.5; // Reduce intensity for sarcastic messages
  }
  
  // Determine final emotion
  if (combinedScore > 3) {
    return 'excited';
  } else if (combinedScore > 1) {
    return 'happy';
  } else if (combinedScore > -1) {
    return 'neutral';
  } else if (combinedScore > -3) {
    return 'sad';
  } else {
    return 'angry';
  }
}

// Legacy sentiment analysis function (kept for backward compatibility)
function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  
  // Enhanced emotion detection based on sentiment score and keywords
  const emotions = {
    happy: ['happy', 'joy', 'excited', 'glad', 'delighted', 'smile', 'great', 'wonderful', 'amazing', 'fantastic', 'love', 'like', 'enjoy'],
    sad: ['sad', 'unhappy', 'disappointed', 'upset', 'depressed', 'sorry', 'regret', 'miss', 'lonely', 'hurt', 'cry', 'tears'],
    angry: ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'hate', 'terrible', 'awful', 'horrible', 'disgusting', 'stupid', 'idiot'],
    surprised: ['surprised', 'shocked', 'amazed', 'astonished', 'wow', 'omg', 'unbelievable', 'incredible', 'what', 'how'],
    excited: ['excited', 'thrilled', 'pumped', 'stoked', 'awesome', 'incredible', 'amazing', 'fantastic', 'brilliant'],
    worried: ['worried', 'anxious', 'nervous', 'scared', 'afraid', 'fear', 'concerned', 'stress', 'panic'],
    neutral: ['neutral', 'calm', 'ok', 'fine', 'alright', 'good', 'well']
  };
  
  const lowerText = text.toLowerCase();
  let detectedEmotion = 'neutral';
  let maxMatches = 0;
  
  // Check for emotion keywords
  for (const [emotion, keywords] of Object.entries(emotions)) {
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedEmotion = emotion;
    }
  }
  
  // Determine sentiment description
  let description = '';
  if (result.score > 2) {
    description = 'very positive and happy';
  } else if (result.score > 0) {
    description = 'positive and content';
  } else if (result.score > -2) {
    description = 'slightly negative or neutral';
  } else if (result.score > -5) {
    description = 'negative and unhappy';
  } else {
    description = 'very negative and distressed';
  }
  
  return {
    score: result.score,
    comparative: result.comparative,
    tokens: result.tokens,
    words: result.words,
    positive: result.positive,
    negative: result.negative,
    emotion: detectedEmotion,
    description: description
  };
}

// Legacy avatar emotion determination (kept for backward compatibility)
function determineAvatarEmotion(userSentiment, aiResponse) {
  // Analyze AI response sentiment as well
  const aiSentiment = sentiment.analyze(aiResponse);
  
  // Combine user sentiment and AI response sentiment
  const combinedScore = userSentiment.score + (aiSentiment.score * 0.5);
  
  // Determine emotion based on combined analysis
  if (combinedScore > 3) {
    return 'excited';
  } else if (combinedScore > 1) {
    return 'happy';
  } else if (combinedScore > -1) {
    return 'neutral';
  } else if (combinedScore > -3) {
    return 'sad';
  } else {
    return 'angry';
  }
}

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log('Enhanced sentiment analysis features:');
  console.log(`  - Emotion detection: ${CONFIG.ENABLE_EMOTION_DETECTION ? '✅' : '❌'}`);
  console.log(`  - Sarcasm detection: ${CONFIG.ENABLE_SARCASTIC_DETECTION ? '✅' : '❌'}`);
  console.log(`  - Intent classification: ${CONFIG.ENABLE_INTENT_CLASSIFICATION ? '✅' : '❌'}`);
  console.log(`  - Subjectivity analysis: ${CONFIG.ENABLE_SUBJECTIVITY_ANALYSIS ? '✅' : '❌'}`);
  console.log(`  - Visual outputs: ${CONFIG.ENABLE_VISUAL_OUTPUTS ? '✅' : '❌'}`);
}); 