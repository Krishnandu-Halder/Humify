// Enhanced Sentiment Analysis Demo
// Run with: node demo.js

const { enhanceSentimentAnalysis, CONFIG } = require('./sentimentEnhancer');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();

console.log('🚀 Enhanced Sentiment Analysis Demo');
console.log('=' .repeat(50));
console.log('Configuration:', CONFIG);
console.log('');

// Demo messages for each feature
const demoMessages = [
  // Emotion Detection
  {
    category: 'Emotion Detection',
    messages: [
      "I'm absolutely thrilled about this news!",
      "This makes me so angry and frustrated!",
      "I'm feeling really sad today",
      "I'm scared about what might happen"
    ]
  },
  
  // Sarcasm Detection
  {
    category: 'Sarcasm Detection',
    messages: [
      "Oh great, another meeting!",
      "Fantastic, just what I needed today!",
      "This is actually really good",
      "I'm genuinely happy about this"
    ]
  },
  
  // Intent Classification
  {
    category: 'Intent Classification',
    messages: [
      "What time is the meeting?",
      "Please send me the report",
      "This product is broken",
      "Thank you for your help"
    ]
  },
  
  // Subjectivity Analysis
  {
    category: 'Subjectivity Analysis',
    messages: [
      "I think this is a great idea",
      "The meeting is at 3 PM",
      "I love this new feature",
      "The data shows a 15% increase"
    ]
  },
  
  // Complex Examples
  {
    category: 'Complex Examples',
    messages: [
      "Why am I so sad about this?",
      "I think this service is terrible",
      "Oh wonderful, my day is completely ruined!",
      "I'm excited to see what happens next"
    ]
  }
];

// Run demo
async function runDemo() {
  for (const category of demoMessages) {
    console.log(`📊 ${category.category}`);
    console.log('-'.repeat(30));
    
    for (const message of category.messages) {
      console.log(`\nInput: "${message}"`);
      
      // Get base sentiment
      const baseSentiment = sentiment.analyze(message);
      
      // Apply enhancements
      const enhanced = enhanceSentimentAnalysis(message, baseSentiment);
      
      // Display results
      console.log('Results:');
      console.log(`  • Sentiment Score: ${enhanced.score}`);
      console.log(`  • Description: ${enhanced.description}`);
      
      if (enhanced.emotions && enhanced.emotions.primary !== 'neutral') {
        console.log(`  • Emotion: ${enhanced.emotions.primary} (${(enhanced.emotions.confidence * 100).toFixed(1)}% confidence)`);
      }
      
      if (enhanced.sarcasm && enhanced.sarcasm.isSarcastic) {
        console.log(`  • Sarcasm: Detected (${(enhanced.sarcasm.confidence * 100).toFixed(1)}% confidence)`);
        if (enhanced.sarcasm.indicators.length > 0) {
          console.log(`    Indicators: ${enhanced.sarcasm.indicators.join(', ')}`);
        }
      }
      
      if (enhanced.intent && enhanced.intent.primary !== 'statement') {
        console.log(`  • Intent: ${enhanced.intent.primary} (${(enhanced.intent.confidence * 100).toFixed(1)}% confidence)`);
      }
      
      if (enhanced.subjectivity) {
        const type = enhanced.subjectivity.isSubjective ? 'Subjective' : 'Objective';
        console.log(`  • Subjectivity: ${type} (${(enhanced.subjectivity.confidence * 100).toFixed(1)}% confidence)`);
      }
      
      if (enhanced.visuals) {
        const visualTags = [];
        if (enhanced.visuals.emotion) visualTags.push(`${enhanced.visuals.emotion.emoji} ${enhanced.visuals.emotion.tag}`);
        if (enhanced.visuals.sentiment) visualTags.push(`${enhanced.visuals.sentiment.emoji} ${enhanced.visuals.sentiment.tag}`);
        if (enhanced.visuals.intent) visualTags.push(`${enhanced.visuals.intent.emoji} ${enhanced.visuals.intent.tag}`);
        console.log(`  • Visual Tags: ${visualTags.join(' | ')}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
  }
  
  console.log('\n✅ Demo completed!');
  console.log('\nTo test with the API:');
  console.log('curl -X POST http://localhost:3003/api/test-enhancements \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Your test message here"}\'');
}

// Run the demo
runDemo().catch(console.error); 