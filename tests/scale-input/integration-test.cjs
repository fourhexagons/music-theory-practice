#!/usr/bin/env node

/**
 * Integration Test: Island Key Cycling with StateManager
 * 
 * Tests that the island key cycling system integrates correctly
 * with StateManager and QuestionGenerator business logic
 */

const fs = require('fs');

console.log('🔗 INTEGRATION TEST: Island Key Cycling with StateManager');
console.log('=======================================================\n');

// Mock DOM elements that StateManager expects
global.document = {
  getElementById: (id) => {
    if (id === 'answer-input') {
      return { value: '' };
    }
    if (id === 'feedback') {
      return { textContent: '', className: '' };
    }
    return null;
  }
};

// Mock window object
global.window = {
  MODES: {
    LINEAR: 'linear',
    RANDOM_KEYS_LINEAR_CHAPTERS: 'random_keys_linear_chapters',
    NAMING_TRIADS: 'naming_triads'
  },
  CHAPTERS: {
    ACCIDENTALS_COUNT: { id: 'accCount', name: 'Accidentals Count' },
    ACCIDENTALS_NAMES: { id: 'accNotes', name: 'Accidentals Naming' },
    SCALE_SPELLING: { id: 'scale', name: 'Scale Spelling' },
    TRIADS: { id: 'triads', name: 'Triads' }
  },
  CORE_CHAPTERS: [
    { id: 'accCount', name: 'Accidentals Count' },
    { id: 'accNotes', name: 'Accidentals Naming' },
    { id: 'scale', name: 'Scale Spelling' },
    { id: 'triads', name: 'Triads' }
  ],
  accidentalToUnicode: (note) => note,
  normalizeAccList: (accList) => accList,
  wordToNumber: (word) => parseInt(word, 10) || 0,
  ordinal: (num) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const mod = num % 100;
    return num + (suffixes[(mod - 20) % 10] || suffixes[mod] || suffixes[0]);
  }
};

// Load quiz data
const quizDataContent = fs.readFileSync('src/data/quizData.js', 'utf8');
const quizDataMatch = quizDataContent.match(/window\.quizData = ({[\s\S]*?});/);
const quizData = eval('(' + quizDataMatch[1] + ')');
window.quizData = quizData;

// Load learning state functions
const learningStateContent = fs.readFileSync('src/state/learningState.js', 'utf8');
const modifiedLearningStateContent = learningStateContent
  .replace(/export\s+{[^}]*}/g, '')
  .replace(/import[^;]*;/g, '');
eval(modifiedLearningStateContent);

// Load StateManager class
const stateManagerContent = fs.readFileSync('src/modules/business/services/StateManager.js', 'utf8');
const modifiedStateManagerContent = stateManagerContent
  .replace('export class StateManager', 'global.StateManager = class StateManager')
  .replace(/import[^;]*;/g, '');
eval(modifiedStateManagerContent);

// Load QuestionGenerator class  
const questionGeneratorContent = fs.readFileSync('src/modules/business/services/QuestionGenerator.js', 'utf8');
const modifiedQuestionGeneratorContent = questionGeneratorContent
  .replace('export class QuestionGenerator', 'global.QuestionGenerator = class QuestionGenerator')
  .replace(/import[^;]*;/g, '');
eval(modifiedQuestionGeneratorContent);

// Make classes available in current scope
const StateManager = global.StateManager;
const QuestionGenerator = global.QuestionGenerator;

let testsPassed = 0;
let testsFailed = 0;

function runTest(testName, testFn) {
  try {
    const result = testFn();
    if (result) {
      testsPassed++;
      console.log(`✅ ${testName}`);
    } else {
      testsFailed++;
      console.log(`❌ ${testName}`);
    }
  } catch (error) {
    testsFailed++;
    console.log(`❌ ${testName} - ERROR: ${error.message}`);
  }
}

// Test: StateManager integration
runTest('StateManager correctly handles key sequence progression', () => {
  window.resetLearningState();
  
  // Set up 1-3 Sharps group like menu does
  const customGroup = {
    name: '1-3 Sharps - G, D, A keys',
    keys: ['G', 'D', 'A'],
    mode: 'random_keys_linear_chapters',
    chapters: window.CORE_CHAPTERS,
    requiredStreak: 3
  };
  
  window.learningState.customGroup = customGroup;
  window.learningState.mode = 'random_keys_linear_chapters';
  
  const stateManager = new StateManager(window.learningState);
  
  // Mock question for progression
  window.learningState.currentQuestion = { 
    key: 'G', 
    chapterId: 'accCount' 
  };
  
  // Handle correct answer progression
  const result = stateManager.handleCorrectAnswer();
  
  return result && result.action === 'askQuestion';
});

// Test: QuestionGenerator integration
runTest('QuestionGenerator works with key sequence system', () => {
  window.resetLearningState();
  
  const customGroup = {
    keys: ['G', 'D', 'A'],
    mode: 'random_keys_linear_chapters',
    chapters: window.CORE_CHAPTERS
  };
  
  window.learningState.customGroup = customGroup;
  
  const stateManager = new StateManager(window.learningState);
  const questionGenerator = new QuestionGenerator(window.quizData, window.learningState, stateManager);
  
  // Generate first question - should start key sequence
  const question1 = questionGenerator.generateQuestion();
  const key1 = question1.key;
  
  // Generate second question - should use same key
  window.advanceKeySequence('accCount');
  stateManager.advanceQuestionPointer();
  const question2 = questionGenerator.generateQuestion();
  const key2 = question2.key;
  
  return question1 && question2 && key1 === key2 && ['G', 'D', 'A'].includes(key1);
});

// Test: Complete mini-sequence simulation
runTest('Complete mini-sequence works end-to-end', () => {
  window.resetLearningState();
  
  const customGroup = {
    keys: ['G', 'D', 'A'],
    mode: 'random_keys_linear_chapters',
    chapters: window.CORE_CHAPTERS,
    requiredStreak: 3
  };
  
  window.learningState.customGroup = customGroup;
  window.learningState.currentChapterIndex = 0;
  
  const stateManager = new StateManager(window.learningState);
  const questionGenerator = new QuestionGenerator(window.quizData, window.learningState, stateManager);
  
  // Track the sequence
  const sequenceKeys = [];
  
  // Generate questions for full sequence: accCount → accNotes → scale → 3 triads
  for (let i = 0; i < 6; i++) { // 4 chapters + 2 more triads
    const question = questionGenerator.generateQuestion();
    sequenceKeys.push(question.key);
    
    // Simulate correct answer
    window.learningState.currentQuestion = question;
    stateManager.handleCorrectAnswer();
  }
  
  // All keys in sequence should be the same
  const allSameKey = sequenceKeys.every(key => key === sequenceKeys[0]);
  const validKey = ['G', 'D', 'A'].includes(sequenceKeys[0]);
  
  return allSameKey && validKey && sequenceKeys.length === 6;
});

// Test: Key cycling across multiple sequences
runTest('Multiple sequences use different keys with cycling', () => {
  window.resetLearningState();
  
  const customGroup = {
    keys: ['G', 'D', 'A'],
    mode: 'random_keys_linear_chapters',
    chapters: window.CORE_CHAPTERS
  };
  
  window.learningState.customGroup = customGroup;
  
  const stateManager = new StateManager(window.learningState);
  const questionGenerator = new QuestionGenerator(window.quizData, window.learningState, stateManager);
  
  const usedKeys = new Set();
  
  // Complete 3 sequences
  for (let seq = 0; seq < 3; seq++) {
    // Reset for new sequence
    window.learningState.currentChapterIndex = 0;
    
    // Get first question of sequence
    const question = questionGenerator.generateQuestion();
    usedKeys.add(question.key);
    
    // Complete the sequence (simplified)
    window.learningState.currentQuestion = question;
    window.advanceKeySequence('accCount');
    window.advanceKeySequence('accNotes');
    window.advanceKeySequence('scale');
    window.advanceKeySequence('triads');
    window.advanceKeySequence('triads');
    window.advanceKeySequence('triads'); // Complete sequence
  }
  
  // Should have used all 3 keys
  return usedKeys.size === 3 && 
         usedKeys.has('G') && 
         usedKeys.has('D') && 
         usedKeys.has('A');
});

// Summary
console.log('\n📊 INTEGRATION TEST SUMMARY');
console.log('============================');
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);

if (testsFailed === 0) {
  console.log('\n🎉 All integration tests passed! System is ready for browser testing.');
} else {
  console.log('\n⚠️  Some integration tests failed. Please review the implementation.');
  process.exit(1);
} 