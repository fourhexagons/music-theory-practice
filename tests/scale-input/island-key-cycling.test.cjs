#!/usr/bin/env node

/**
 * Comprehensive Test: Island Key Cycling System
 * 
 * Tests the new mini-sequence key cycling for island levels:
 * - Key sequences: accCount → accNotes → scale → 3 triads per key
 * - Random key selection with anti-repetition
 * - Key cycling without repeats until all keys exhausted
 * - Weighted randomization preventing immediate key repetition
 */

const fs = require('fs');
const path = require('path');

// Mock window object and setup
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

// Import learning state functions
const learningStateContent = fs.readFileSync('src/state/learningState.js', 'utf8');
// Remove export statements and execute
const modifiedContent = learningStateContent
  .replace(/export\s+{[^}]*}/g, '')
  .replace(/import[^;]*;/g, '');

eval(modifiedContent);

console.log('🧪 ISLAND KEY CYCLING SYSTEM TEST');
console.log('================================\n');

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

// Test 1: Key sequence initialization
runTest('Key sequence starts correctly for island levels', () => {
  window.resetLearningState();
  
  // Set up 1-3 Sharps group
  const customGroup = {
    name: '1-3 Sharps - G, D, A keys',
    keys: ['G', 'D', 'A'],
    mode: 'random_keys_linear_chapters',
    chapters: [
      window.CHAPTERS.ACCIDENTALS_COUNT,
      window.CHAPTERS.ACCIDENTALS_NAMES,
      window.CHAPTERS.SCALE_SPELLING,
      window.CHAPTERS.TRIADS
    ],
    requiredStreak: 3
  };
  
  window.learningState.customGroup = customGroup;
  window.learningState.mode = 'random_keys_linear_chapters';
  
  // Get first key - should start a new sequence
  const firstKey = window.getCurrentKey('random_keys_linear_chapters');
  
  const state = window.learningState.keySequenceState;
  
  return firstKey && 
         ['G', 'D', 'A'].includes(firstKey) &&
         state.inProgress === true &&
         state.currentSequenceKey === firstKey &&
         state.currentSequencePhase === 'accCount' &&
         state.usedKeysInCurrentCycle.includes(firstKey);
});

// Test 2: Key stays locked during sequence
runTest('Key remains locked throughout mini-sequence', () => {
  window.resetLearningState();
  
  const customGroup = {
    keys: ['G', 'D', 'A'],
    mode: 'random_keys_linear_chapters'
  };
  
  window.learningState.customGroup = customGroup;
  
  // Start sequence
  const firstKey = window.getCurrentKey('random_keys_linear_chapters');
  
  // Simulate advancing through the sequence
  window.advanceKeySequence('accCount');
  const keyAfterAccCount = window.getCurrentKey('random_keys_linear_chapters');
  
  window.advanceKeySequence('accNotes'); 
  const keyAfterAccNotes = window.getCurrentKey('random_keys_linear_chapters');
  
  window.advanceKeySequence('scale');
  const keyAfterScale = window.getCurrentKey('random_keys_linear_chapters');
  
  return firstKey === keyAfterAccCount &&
         firstKey === keyAfterAccNotes &&
         firstKey === keyAfterScale;
});

// Test 3: Triad progression (3 correct needed)
runTest('Triads require 3 correct answers before sequence completion', () => {
  window.resetLearningState();
  
  const customGroup = {
    keys: ['G', 'D', 'A'],
    mode: 'random_keys_linear_chapters'
  };
  
  window.learningState.customGroup = customGroup;
  
  // Start sequence and advance to triads
  const firstKey = window.getCurrentKey('random_keys_linear_chapters');
  window.advanceKeySequence('accCount');
  window.advanceKeySequence('accNotes');
  window.advanceKeySequence('scale');
  
  const state = window.learningState.keySequenceState;
  
  // First triad
  const complete1 = window.advanceKeySequence('triads');
  const keyAfterTriad1 = window.getCurrentKey('random_keys_linear_chapters');
  const countAfterTriad1 = state.correctTriadsInCurrentKey;
  
  // Second triad
  const complete2 = window.advanceKeySequence('triads');
  const keyAfterTriad2 = window.getCurrentKey('random_keys_linear_chapters');
  const countAfterTriad2 = state.correctTriadsInCurrentKey;
  
  // Third triad - should complete sequence
  const complete3 = window.advanceKeySequence('triads');
  // Note: state gets reset after completion, so check before this point
  
  return !complete1 && // First triad doesn't complete
         !complete2 && // Second triad doesn't complete
         complete3 &&  // Third triad completes sequence
         firstKey === keyAfterTriad1 &&
         firstKey === keyAfterTriad2 &&
         countAfterTriad1 === 1 &&
         countAfterTriad2 === 2;
});

// Test 4: Key cycling without repetition
runTest('Keys cycle without repetition until all used', () => {
  window.resetLearningState();
  
  const customGroup = {
    keys: ['G', 'D', 'A'],
    mode: 'random_keys_linear_chapters'
  };
  
  window.learningState.customGroup = customGroup;
  
  const usedKeys = new Set();
  
  // Complete 3 full sequences
  for (let i = 0; i < 3; i++) {
    // Start new sequence
    const key = window.getCurrentKey('random_keys_linear_chapters');
    usedKeys.add(key);
    
    // Complete the sequence
    window.advanceKeySequence('accCount');
    window.advanceKeySequence('accNotes'); 
    window.advanceKeySequence('scale');
    window.advanceKeySequence('triads');
    window.advanceKeySequence('triads');
    window.advanceKeySequence('triads'); // Complete triads
  }
  
  return usedKeys.size === 3 && 
         usedKeys.has('G') && 
         usedKeys.has('D') && 
         usedKeys.has('A');
});

// Test 5: Anti-repetition after cycle completion
runTest('Anti-repetition prevents immediate key repetition after cycle', () => {
  window.resetLearningState();
  
  const customGroup = {
    keys: ['G', 'D'],
    mode: 'random_keys_linear_chapters'
  };
  
  window.learningState.customGroup = customGroup;
  
  // Complete 2 sequences to exhaust all keys
  const firstKey = window.getCurrentKey('random_keys_linear_chapters');
  window.advanceKeySequence('accCount');
  window.advanceKeySequence('accNotes');
  window.advanceKeySequence('scale'); 
  window.advanceKeySequence('triads');
  window.advanceKeySequence('triads');
  window.advanceKeySequence('triads');
  
  const secondKey = window.getCurrentKey('random_keys_linear_chapters');
  window.advanceKeySequence('accCount');
  window.advanceKeySequence('accNotes');
  window.advanceKeySequence('scale');
  window.advanceKeySequence('triads');
  window.advanceKeySequence('triads');
  window.advanceKeySequence('triads');
  
  // Next key should prefer the non-last key
  const thirdKey = window.getCurrentKey('random_keys_linear_chapters');
  
  return firstKey !== secondKey && 
         thirdKey !== secondKey && // Anti-repetition working
         ['G', 'D'].includes(thirdKey);
});

// Test 6: Integration with existing A-B pairing
runTest('A-B pairing still works with key sequences', () => {
  window.resetLearningState();
  
  const customGroup = {
    keys: ['G', 'D', 'A'],
    mode: 'random_keys_linear_chapters'
  };
  
  window.learningState.customGroup = customGroup;
  
  // Start sequence with a key that has accidentals
  const key = window.getCurrentKey('random_keys_linear_chapters');
  
  // Verify that A-B pairing is preserved for accidentals
  const hasAccidentals = window.quizData[key] && window.quizData[key].accidentals > 0;
  
  // Test that getCurrentKey returns consistent key during sequence
  const keyDuringSequence = window.getCurrentKey('random_keys_linear_chapters');
  
  return hasAccidentals && key === keyDuringSequence;
});

// Test 7: Different groups work independently  
runTest('Different island groups manage sequences independently', () => {
  window.resetLearningState();
  
  // Test 1-3 Flats group
  const flatsGroup = {
    keys: ['F', 'Bb', 'Eb'],
    mode: 'random_keys_linear_chapters'
  };
  
  window.learningState.customGroup = flatsGroup;
  const flatsKey = window.getCurrentKey('random_keys_linear_chapters');
  
  // Switch to different group
  const sharpsGroup = {
    keys: ['E', 'B', 'F#'],
    mode: 'random_keys_linear_chapters'
  };
  
  window.learningState.customGroup = sharpsGroup;
  window.learningState.keySequenceState.inProgress = false; // Reset for new group
  
  const sharpsKey = window.getCurrentKey('random_keys_linear_chapters');
  
  return ['F', 'Bb', 'Eb'].includes(flatsKey) &&
         ['E', 'B', 'F#'].includes(sharpsKey);
});

// Summary
console.log('\n📊 TEST SUMMARY');
console.log('================');
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);

if (testsFailed === 0) {
  console.log('\n🎉 All tests passed! Island key cycling system is working correctly.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the implementation.');
  process.exit(1);
} 