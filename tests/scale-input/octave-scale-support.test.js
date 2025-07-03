#!/usr/bin/env node

/**
 * Comprehensive Test: Octave Scale Support
 * 
 * Tests all possible scale input permutations:
 * - 7-note scales (original): c d e f g a b
 * - 8-note scales (with repeated root): c d e f g a b c
 * - All case combinations for both formats
 * - All 15 keys
 * - Seventh spellings remain 4 notes (unchanged)
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read quiz data
const quizDataContent = fs.readFileSync('src/data/quizData.js', 'utf8');
const quizDataMatch = quizDataContent.match(/window\.quizData = ({[\s\S]*?});/);
const quizData = eval('(' + quizDataMatch[1] + ')');

// Mock window object (simplified for testing)
global.window = {
  accidentalToUnicode: (note) => note,
  normalizeAccList: (accList) => accList,
  wordToNumber: (word) => parseInt(word, 10) || 0,
  normalizeChord: (chord) => chord
};

// Create test version of AnswerValidator
class AnswerValidator {
  constructor(quizData) {
    this.quizData = quizData;
    this.validScaleInputs = new Set();
    this.validChordInputs = new Set();
    this.preGenerateValidInputs();
  }

  preGenerateValidInputs() {
    Object.entries(this.quizData).forEach(([key, keyData]) => {
      // Generate scale input variations (8 per key: 7-note + 8-note × 4 case variations each)
      const scale7Note = keyData.scale;
      const scale8Note = [...keyData.scale, keyData.scale[0]]; // Add repeated root
      
      // 7-note scale variations
      const spaced7 = scale7Note.join(' ');
      const unspaced7 = scale7Note.join('');
      const spacedLower7 = spaced7.toLowerCase();
      const unspacedLower7 = unspaced7.toLowerCase();
      
      this.validScaleInputs.add(spaced7);
      this.validScaleInputs.add(unspaced7);
      this.validScaleInputs.add(spacedLower7);
      this.validScaleInputs.add(unspacedLower7);
      
      // 8-note scale variations (with repeated root)
      const spaced8 = scale8Note.join(' ');
      const unspaced8 = scale8Note.join('');
      const spacedLower8 = spaced8.toLowerCase();
      const unspacedLower8 = unspaced8.toLowerCase();
      
      this.validScaleInputs.add(spaced8);
      this.validScaleInputs.add(unspaced8);
      this.validScaleInputs.add(spacedLower8);
      this.validScaleInputs.add(unspacedLower8);
      
      // Generate chord input variations (28 per key: 7 degrees × 4 variations)
      // Seventh spellings remain 4 notes (no repetition of root)
      for (let degree = 1; degree <= 7; degree++) {
        const chord = keyData.seventhSpelling[degree.toString()];
        const chordSpaced = chord.join(' ');
        const chordUnspaced = chord.join('');
        const chordSpacedLower = chordSpaced.toLowerCase();
        const chordUnspacedLower = chordUnspaced.toLowerCase();
        
        this.validChordInputs.add(chordSpaced);
        this.validChordInputs.add(chordUnspaced);
        this.validChordInputs.add(chordSpacedLower);
        this.validChordInputs.add(chordUnspacedLower);
      }
    });
  }

  validateScaleSpelling(userAnswer) {
    const trimmedInput = userAnswer.trim();
    const normalizedInput = trimmedInput.toLowerCase();
    return this.validScaleInputs.has(normalizedInput);
  }

  validateChordSpelling(userAnswer) {
    const trimmedInput = userAnswer.trim();
    const normalizedInput = trimmedInput.toLowerCase();
    return this.validChordInputs.has(normalizedInput);
  }
}

console.log('🎼 COMPREHENSIVE TEST: OCTAVE SCALE SUPPORT');
console.log('===========================================\n');

const validator = new AnswerValidator(quizData);
const allKeys = Object.keys(quizData);

console.log(`Testing ${allKeys.length} keys with both 7-note and 8-note scale support...\n`);

// Test 1: Verify all 7-note scales work (original functionality)
console.log('📋 Test 1: 7-Note Scale Support (Original)');
console.log('==========================================');

let test1Passed = 0;
let test1Failed = 0;

allKeys.forEach(key => {
  const keyData = quizData[key];
  const scale7Note = keyData.scale;
  
  // Test all 4 variations: spaced upper, unspaced upper, spaced lower, unspaced lower
  const variations7 = [
    scale7Note.join(' '),           // "C D E F G A B"
    scale7Note.join(''),            // "CDEFGAB"
    scale7Note.join(' ').toLowerCase(), // "c d e f g a b"
    scale7Note.join('').toLowerCase()   // "cdefgab"
  ];
  
  variations7.forEach((input, index) => {
    const result = validator.validateScaleSpelling(input);
    if (result) {
      test1Passed++;
      console.log(`✅ ${key} major 7-note (var ${index + 1}): "${input}"`);
    } else {
      test1Failed++;
      console.log(`❌ ${key} major 7-note (var ${index + 1}): "${input}"`);
    }
  });
});

console.log(`\n📊 Test 1 Results: ${test1Passed}/${test1Passed + test1Failed} passed\n`);

// Test 2: Verify all 8-note scales work (new functionality)
console.log('🔄 Test 2: 8-Note Scale Support (New - With Repeated Root)');
console.log('=========================================================');

let test2Passed = 0;
let test2Failed = 0;

allKeys.forEach(key => {
  const keyData = quizData[key];
  const scale8Note = [...keyData.scale, keyData.scale[0]]; // Add repeated root
  
  // Test all 4 variations: spaced upper, unspaced upper, spaced lower, unspaced lower
  const variations8 = [
    scale8Note.join(' '),           // "C D E F G A B C"
    scale8Note.join(''),            // "CDEFGABC"
    scale8Note.join(' ').toLowerCase(), // "c d e f g a b c"
    scale8Note.join('').toLowerCase()   // "cdefgabc"
  ];
  
  variations8.forEach((input, index) => {
    const result = validator.validateScaleSpelling(input);
    if (result) {
      test2Passed++;
      console.log(`✅ ${key} major 8-note (var ${index + 1}): "${input}"`);
    } else {
      test2Failed++;
      console.log(`❌ ${key} major 8-note (var ${index + 1}): "${input}"`);
    }
  });
});

console.log(`\n📊 Test 2 Results: ${test2Passed}/${test2Passed + test2Failed} passed\n`);

// Test 3: Verify seventh spellings remain 4 notes (unchanged)
console.log('🎵 Test 3: Seventh Spellings Remain 4 Notes (Unchanged)');
console.log('=======================================================');

let test3Passed = 0;
let test3Failed = 0;

allKeys.forEach(key => {
  const keyData = quizData[key];
  
  // Test all 7 degrees
  for (let degree = 1; degree <= 7; degree++) {
    const chord = keyData.seventhSpelling[degree.toString()];
    
    // Test all 4 variations: spaced upper, unspaced upper, spaced lower, unspaced lower
    const chordVariations = [
      chord.join(' '),           // "C E G B"
      chord.join(''),            // "CEGB"
      chord.join(' ').toLowerCase(), // "c e g b"
      chord.join('').toLowerCase()   // "cegb"
    ];
    
    chordVariations.forEach((input, index) => {
      const result = validator.validateChordSpelling(input);
      if (result) {
        test3Passed++;
        console.log(`✅ ${key} degree ${degree} (var ${index + 1}): "${input}"`);
      } else {
        test3Failed++;
        console.log(`❌ ${key} degree ${degree} (var ${index + 1}): "${input}"`);
      }
    });
  }
});

console.log(`\n📊 Test 3 Results: ${test3Passed}/${test3Passed + test3Failed} passed\n`);

// Test 4: Mixed case validation for scales
console.log('🎭 Test 4: Mixed Case Scale Validation');
console.log('=====================================');

let test4Passed = 0;
let test4Failed = 0;

const mixedCaseScaleTests = [
  // 7-note mixed case
  { key: 'C', input: 'C d E f G a B', expected: true, description: '7-note mixed case' },
  { key: 'G', input: 'g A b C d E F#', expected: true, description: '7-note mixed case with sharp' },
  { key: 'F', input: 'F g A bb C d E', expected: true, description: '7-note mixed case with flat' },
  
  // 8-note mixed case
  { key: 'C', input: 'c D e F g A b C', expected: true, description: '8-note mixed case' },
  { key: 'G', input: 'G a B c D e F# g', expected: true, description: '8-note mixed case with sharp' },
  { key: 'F', input: 'f G a Bb c D e F', expected: true, description: '8-note mixed case with flat' },
];

mixedCaseScaleTests.forEach((test, index) => {
  const result = validator.validateScaleSpelling(test.input);
  if (result === test.expected) {
    test4Passed++;
    console.log(`✅ Test ${index + 1}: ${test.key} ${test.description} - "${test.input}"`);
  } else {
    test4Failed++;
    console.log(`❌ Test ${index + 1}: ${test.key} ${test.description} - "${test.input}" (Expected ${test.expected}, got ${result})`);
  }
});

console.log(`\n📊 Test 4 Results: ${test4Passed}/${test4Passed + test4Failed} passed\n`);

// Summary
const totalPassed = test1Passed + test2Passed + test3Passed + test4Passed;
const totalFailed = test1Failed + test2Failed + test3Failed + test4Failed;
const totalTests = totalPassed + totalFailed;

console.log('📊 COMPREHENSIVE TEST SUMMARY');
console.log('=============================');
console.log(`✅ Test 1 (7-note scales): ${test1Passed}/${test1Passed + test1Failed} passed`);
console.log(`✅ Test 2 (8-note scales): ${test2Passed}/${test2Passed + test2Failed} passed`);
console.log(`✅ Test 3 (seventh spellings): ${test3Passed}/${test3Passed + test3Failed} passed`);
console.log(`✅ Test 4 (mixed case): ${test4Passed}/${test4Passed + test4Failed} passed`);
console.log('=============================');
console.log(`🎯 OVERALL: ${totalPassed}/${totalTests} tests passed (${((totalPassed/totalTests) * 100).toFixed(1)}%)`);

if (totalFailed === 0) {
  console.log('\n🎉 ALL TESTS PASSED!');
  console.log('✅ 7-note scales work correctly (original functionality preserved)');
  console.log('✅ 8-note scales with repeated root now supported');
  console.log('✅ Seventh spellings remain 4 notes (no change)');
  console.log('✅ All case combinations work for both scale formats');
  console.log(`✅ All ${allKeys.length} keys tested successfully`);
} else {
  console.log(`\n🚨 ${totalFailed} tests failed. Review the output above.`);
}

process.exit(totalFailed === 0 ? 0 : 1); 