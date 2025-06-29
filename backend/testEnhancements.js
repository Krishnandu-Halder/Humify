// Test Runner for Enhanced Sentiment Analysis
// Run with: node testEnhancements.js

const fs = require('fs');
const path = require('path');
const { enhanceSentimentAnalysis, CONFIG } = require('./sentimentEnhancer');
const Sentiment = require('sentiment');

// Initialize base sentiment analyzer
const sentiment = new Sentiment();

// Load test sentences
const testSentences = JSON.parse(fs.readFileSync(path.join(__dirname, 'test_sentences.json'), 'utf8'));

/**
 * Run tests for a specific category
 * @param {string} category - Test category name
 * @param {Object} testCases - Test cases for the category
 * @param {Function} testFunction - Function to test
 */
function runCategoryTests(category, testCases, testFunction) {
  console.log(`\n🧪 Testing ${category.toUpperCase()}:`);
  console.log('='.repeat(50));
  
  let passed = 0;
  let total = 0;
  
  for (const [subcategory, sentences] of Object.entries(testCases)) {
    console.log(`\n📝 ${subcategory}:`);
    
    for (const sentence of sentences) {
      total++;
      const result = testFunction(sentence);
      const baseSentiment = sentiment.analyze(sentence);
      const enhanced = enhanceSentimentAnalysis(sentence, baseSentiment);
      
      // Display results
      console.log(`  Input: "${sentence}"`);
      console.log(`  Result: ${JSON.stringify(result, null, 2)}`);
      console.log(`  Enhanced: ${JSON.stringify(enhanced, null, 2)}`);
      console.log('  ---');
      
      passed++;
    }
  }
  
  console.log(`\n✅ ${category}: ${passed}/${total} tests completed`);
  return { passed, total };
}

/**
 * Test emotion detection
 */
function testEmotionDetection() {
  const results = {};
  
  for (const [emotion, sentences] of Object.entries(testSentences.emotion_detection)) {
    results[emotion] = [];
    
    for (const sentence of sentences) {
      const baseSentiment = sentiment.analyze(sentence);
      const enhanced = enhanceSentimentAnalysis(sentence, baseSentiment);
      results[emotion].push({
        sentence,
        detected: enhanced.emotions?.primary,
        confidence: enhanced.emotions?.confidence,
        expected: emotion
      });
    }
  }
  
  return results;
}

/**
 * Test sarcasm detection
 */
function testSarcasmDetection() {
  const results = {};
  
  for (const [category, sentences] of Object.entries(testSentences.sarcasm_detection)) {
    results[category] = [];
    
    for (const sentence of sentences) {
      const baseSentiment = sentiment.analyze(sentence);
      const enhanced = enhanceSentimentAnalysis(sentence, baseSentiment);
      results[category].push({
        sentence,
        isSarcastic: enhanced.sarcasm?.isSarcastic,
        confidence: enhanced.sarcasm?.confidence,
        indicators: enhanced.sarcasm?.indicators
      });
    }
  }
  
  return results;
}

/**
 * Test intent classification
 */
function testIntentClassification() {
  const results = {};
  
  for (const [intent, sentences] of Object.entries(testSentences.intent_classification)) {
    results[intent] = [];
    
    for (const sentence of sentences) {
      const baseSentiment = sentiment.analyze(sentence);
      const enhanced = enhanceSentimentAnalysis(sentence, baseSentiment);
      results[intent].push({
        sentence,
        detected: enhanced.intent?.primary,
        confidence: enhanced.intent?.confidence,
        expected: intent
      });
    }
  }
  
  return results;
}

/**
 * Test subjectivity analysis
 */
function testSubjectivityAnalysis() {
  const results = {};
  
  for (const [category, sentences] of Object.entries(testSentences.subjectivity_analysis)) {
    results[category] = [];
    
    for (const sentence of sentences) {
      const baseSentiment = sentiment.analyze(sentence);
      const enhanced = enhanceSentimentAnalysis(sentence, baseSentiment);
      results[category].push({
        sentence,
        isSubjective: enhanced.subjectivity?.isSubjective,
        confidence: enhanced.subjectivity?.confidence,
        indicators: enhanced.subjectivity?.indicators
      });
    }
  }
  
  return results;
}

/**
 * Test visual outputs
 */
function testVisualOutputs() {
  const results = [];
  
  // Test a few sample sentences
  const sampleSentences = [
    "I'm so happy about this!",
    "This makes me really angry!",
    "What time is the meeting?",
    "Thank you for your help!",
    "This is absolutely disgusting!"
  ];
  
  for (const sentence of sampleSentences) {
    const baseSentiment = sentiment.analyze(sentence);
    const enhanced = enhanceSentimentAnalysis(sentence, baseSentiment);
    results.push({
      sentence,
      visuals: enhanced.visuals
    });
  }
  
  return results;
}

/**
 * Main test runner
 */
function runAllTests() {
  console.log('🚀 Starting Enhanced Sentiment Analysis Tests');
  console.log('='.repeat(60));
  
  // Display configuration
  console.log('\n⚙️  Configuration:');
  console.log(JSON.stringify(CONFIG, null, 2));
  
  // Test each enhancement
  console.log('\n📊 Emotion Detection Results:');
  const emotionResults = testEmotionDetection();
  console.log(JSON.stringify(emotionResults, null, 2));
  
  console.log('\n📊 Sarcasm Detection Results:');
  const sarcasmResults = testSarcasmDetection();
  console.log(JSON.stringify(sarcasmResults, null, 2));
  
  console.log('\n📊 Intent Classification Results:');
  const intentResults = testIntentClassification();
  console.log(JSON.stringify(intentResults, null, 2));
  
  console.log('\n📊 Subjectivity Analysis Results:');
  const subjectivityResults = testSubjectivityAnalysis();
  console.log(JSON.stringify(subjectivityResults, null, 2));
  
  console.log('\n📊 Visual Outputs Results:');
  const visualResults = testVisualOutputs();
  console.log(JSON.stringify(visualResults, null, 2));
  
  // Test complex examples
  console.log('\n📊 Complex Examples Results:');
  for (const [category, sentences] of Object.entries(testSentences.complex_examples)) {
    console.log(`\n${category}:`);
    for (const sentence of sentences) {
      const baseSentiment = sentiment.analyze(sentence);
      const enhanced = enhanceSentimentAnalysis(sentence, baseSentiment);
      console.log(`  "${sentence}"`);
      console.log(`  Enhanced: ${JSON.stringify(enhanced, null, 2)}`);
    }
  }
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testEmotionDetection,
  testSarcasmDetection,
  testIntentClassification,
  testSubjectivityAnalysis,
  testVisualOutputs
}; 