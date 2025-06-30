/**
 * Music Theory Practice - Comprehensive Test Suite
 * 
 * This file contains all tests for the music theory app.
 * Run tests by pressing Ctrl+Shift+Q (or Cmd+Shift+Q on Mac)
 */

import { runTests as runChordNormalizationEdgeCases } from './chord-normalization.test.js';
import { accidentalToUnicode } from '../../src/utils/helpers.js';
import { normalizeChord } from '../../src/utils/normalization.js';

// Test configuration
const TEST_CONFIG = {
  autoRun: false, // Set to true to run tests automatically on page load
  keyboardShortcut: true, // Enable keyboard shortcut (Ctrl+Shift+T)
  showConsoleOutput: true, // Show detailed console output
  openInNewTab: true // Open results in new tab (fallback to overlay if blocked)
};

// Test data and utilities
const TEST_UTILS = {
  // Helper function to create test result object
  createTestResult: (passed, failed, failures, total) => ({
    passed, failed, failures, total
  }),

  // Helper function to format test results
  formatTestResult: (result) => {
    const percentage = result.total > 0 ? Math.round((result.passed / result.total) * 100) : 0;
    return `${result.passed}/${result.total} passed (${percentage}%)`;
  },

  // Helper function to log test results
  logTestResult: (category, result) => {
    const status = result.failed === 0 ? '✅' : '❌';
    console.log(`${status} ${category}: ${TEST_UTILS.formatTestResult(result)}`);
    
    if (result.failed > 0) {
      console.log('  Failed tests:');
      result.failures.forEach(failure => console.log(`    ❌ ${failure}`));
    }
  }
};

// Test Categories
const TEST_CATEGORIES = {
  chordNormalization: {
    name: '🎵 Chord Normalization',
    description: 'Tests chord symbol normalization and variations',
    run: runChordNormalizationTests
  },
  chordNormalizationEdgeCases: {
    name: '🎵 Chord Normalization Edge Cases',
    description: 'Tests specific edge cases in chord normalization',
    run: runChordNormalizationEdgeCases
  },
  accidentalNormalization: {
    name: '🎼 Accidental Normalization',
    description: 'Tests note/accidental conversion to Unicode',
    run: runAccidentalNormalizationTests
  },
  functionExistence: {
    name: '🔧 Function Existence',
    description: 'Tests that core functions exist and are callable',
    run: runFunctionExistenceTests
  },
  appState: {
    name: '📊 App State',
    description: 'Tests app state management and initialization',
    run: runAppStateTests
  }
};

// Test Functions
function runChordNormalizationTests() {
  const tests = [
    // Specific User Cases
    { input: "G# dim", expected: "G♯˚", description: "7th triad in A major - G# dim" },
    { input: "Ab∆", expected: "A♭maj7", description: "4th seventh chord in Eb major - Ab∆" },
    { input: "C∆", expected: "Cmaj7", description: "4th seventh chord in G major - C∆" },
    { input: "d dim", expected: "D˚", description: "7th triad in Eb major - d dim" },
    { input: "Bb-7", expected: "B♭m7", description: "6th seventh chord in Db major - Bb-7" },
    
    // All Chord Variations
    { input: "Cmaj7", expected: "Cmaj7", description: "Major 7th - maj7" },
    { input: "CM7", expected: "Cmaj7", description: "Major 7th - M7" },
    { input: "CΔ", expected: "Cmaj7", description: "Major 7th - Δ" },
    { input: "CΔ7", expected: "Cmaj7", description: "Major 7th - Δ7" },
    { input: "CMAJ7", expected: "Cmaj7", description: "Major 7th - MAJ7" },
    { input: "CMAJOR7", expected: "Cmaj7", description: "Major 7th - MAJOR7" },
    { input: "Cm", expected: "Cm", description: "Minor - m" },
    { input: "C-", expected: "Cm", description: "Minor - dash" },
    { input: "Cmin", expected: "Cm", description: "Minor - min" },
    { input: "Cminor", expected: "Cm", description: "Minor - minor" },
    { input: "C˚", expected: "C˚", description: "Diminished - ˚" },
    { input: "Cdim", expected: "C˚", description: "Diminished - dim" },
    { input: "Cdimin", expected: "C˚", description: "Diminished - dimin" },
    { input: "Cdiminished", expected: "C˚", description: "Diminished - diminished" },
    { input: "C7", expected: "C7", description: "Dominant 7th - 7" },
    { input: "Cdom", expected: "C7", description: "Dominant 7th - dom" },
    { input: "Cdominant", expected: "C7", description: "Dominant 7th - dominant" },
    { input: "Cm7", expected: "Cm7", description: "Minor 7th - m7" },
    { input: "C-7", expected: "Cm7", description: "Minor 7th - dash7" },
    { input: "Cmin7", expected: "Cm7", description: "Minor 7th - min7" },
    { input: "Cminor7", expected: "Cm7", description: "Minor 7th - minor7" },
    { input: "Cm7b5", expected: "Cm7♭5", description: "Half diminished - m7b5" },
    { input: "Cm7♭5", expected: "Cm7♭5", description: "Half diminished - m7♭5" },
    { input: "Cø", expected: "Cm7♭5", description: "Half diminished - ø" },
    { input: "Cø7", expected: "Cm7♭5", description: "Half diminished - ø7" },
    { input: "Bb", expected: "B♭", description: "Flat - Bb" },
    { input: "B♭", expected: "B♭", description: "Flat - B♭" },
    { input: "Bbm", expected: "B♭m", description: "Flat minor - Bbm" },
    { input: "B♭m", expected: "B♭m", description: "Flat minor - B♭m" },
    { input: "Bbm7", expected: "B♭m7", description: "Flat minor 7th - Bbm7" },
    { input: "B♭m7", expected: "B♭m7", description: "Flat minor 7th - B♭m7" },
    { input: "Bbmaj7", expected: "B♭maj7", description: "Flat major 7th - Bbmaj7" },
    { input: "B♭maj7", expected: "B♭maj7", description: "Flat major 7th - B♭maj7" },
    { input: "BbΔ", expected: "B♭maj7", description: "Flat major 7th - BbΔ" },
    { input: "B♭Δ", expected: "B♭maj7", description: "Flat major 7th - B♭Δ" },
    { input: "Bb7", expected: "B♭7", description: "Flat dominant 7th - Bb7" },
    { input: "B♭7", expected: "B♭7", description: "Flat dominant 7th - B♭7" },
    { input: "Bbdim", expected: "B♭˚", description: "Flat diminished - Bbdim" },
    { input: "B♭dim", expected: "B♭˚", description: "Flat diminished - B♭dim" },
    { input: "F#", expected: "F♯", description: "Sharp - F#" },
    { input: "F♯", expected: "F♯", description: "Sharp - F♯" },
    { input: "F#m", expected: "F♯m", description: "Sharp minor - F#m" },
    { input: "F♯m", expected: "F♯m", description: "Sharp minor - F♯m" },
    { input: "F#m7", expected: "F♯m7", description: "Sharp minor 7th - F#m7" },
    { input: "F♯m7", expected: "F♯m7", description: "Sharp minor 7th - F♯m7" },
    { input: "F#maj7", expected: "F♯maj7", description: "Sharp major 7th - F#maj7" },
    { input: "F♯maj7", expected: "F♯maj7", description: "Sharp major 7th - F♯maj7" },
    { input: "F#Δ", expected: "F♯maj7", description: "Sharp major 7th - F#Δ" },
    { input: "F♯Δ", expected: "F♯maj7", description: "Sharp major 7th - F♯Δ" },
    { input: "F#7", expected: "F♯7", description: "Sharp dominant 7th - F#7" },
    { input: "F♯7", expected: "F♯7", description: "Sharp dominant 7th - F♯7" },
    { input: "F#dim", expected: "F♯˚", description: "Sharp diminished - F#dim" },
    { input: "F♯dim", expected: "F♯˚", description: "Sharp diminished - F♯dim" },
    { input: "b", expected: "B", description: "Standalone b = note B" },
    { input: "B", expected: "B", description: "Note B" },
    { input: "C", expected: "C", description: "Note C" },
    { input: "D", expected: "D", description: "Note D" },
    { input: "E", expected: "E", description: "Note E" },
    { input: "F", expected: "F", description: "Note F" },
    { input: "G", expected: "G", description: "Note G" },
    { input: "A", expected: "A", description: "Note A" }
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  tests.forEach(test => {
    try {
      const result = normalizeChord(test.input);
      if (result === test.expected) {
        passed++;
      } else {
        failed++;
        failures.push(`${test.description}: "${test.input}" → "${result}" (expected "${test.expected}")`);
      }
    } catch (error) {
      failed++;
      failures.push(`${test.description}: Error - ${error.message}`);
    }
  });

  return TEST_UTILS.createTestResult(passed, failed, failures, tests.length);
}

function runAccidentalNormalizationTests() {
  const tests = [
    // Basic accidentals
    { input: "Bb", expected: "B♭", description: "Basic flat - Bb" },
    { input: "F#", expected: "F♯", description: "Basic sharp - F#" },
    { input: "C#", expected: "C♯", description: "Basic sharp - C#" },
    { input: "Eb", expected: "E♭", description: "Basic flat - Eb" },
    { input: "Ab", expected: "A♭", description: "Basic flat - Ab" },
    { input: "G#", expected: "G♯", description: "Basic sharp - G#" },
    { input: "D#", expected: "D♯", description: "Basic sharp - D#" },
    { input: "Db", expected: "D♭", description: "Basic flat - Db" },
    
    // Already normalized
    { input: "B♭", expected: "B♭", description: "Already normalized flat - B♭" },
    { input: "F♯", expected: "F♯", description: "Already normalized sharp - F♯" },
    { input: "C♯", expected: "C♯", description: "Already normalized sharp - C♯" },
    { input: "E♭", expected: "E♭", description: "Already normalized flat - E♭" },
    
    // Double accidentals
    { input: "Bbb", expected: "B♭♭", description: "Double flat - Bbb" },
    { input: "F##", expected: "F♯♯", description: "Double sharp - F##" },
    { input: "Cx", expected: "C♯♯", description: "Double sharp - Cx" },
    { input: "B♭♭", expected: "B♭♭", description: "Already normalized double flat - B♭♭" },
    { input: "F♯♯", expected: "F♯♯", description: "Already normalized double sharp - F♯♯" },
    
    // Edge cases
    { input: "b", expected: "B", description: "Standalone b = note B" },
    { input: "B", expected: "B", description: "Note B" },
    { input: "C", expected: "C", description: "Note C" },
    { input: "D", expected: "D", description: "Note D" },
    { input: "E", expected: "E", description: "Note E" },
    { input: "F", expected: "F", description: "Note F" },
    { input: "G", expected: "G", description: "Note G" },
    { input: "A", expected: "A", description: "Note A" },
    { input: "", expected: "", description: "Empty string" },
    { input: "invalid", expected: "INVALID", description: "Invalid input" },
    { input: "X#", expected: "X♯", description: "Invalid note with sharp" },
    { input: "Yb", expected: "Y♭", description: "Invalid note with flat" },
    
    // Mixed case
    { input: "bb", expected: "B♭", description: "Lowercase bb" },
    { input: "f#", expected: "F♯", description: "Lowercase f#" },
    { input: "c#", expected: "C♯", description: "Lowercase c#" },
    { input: "eb", expected: "E♭", description: "Lowercase eb" },
    
    // Whitespace handling
    { input: " Bb ", expected: "B♭", description: "Whitespace around Bb" },
    { input: " F# ", expected: "F♯", description: "Whitespace around F#" },
    { input: "  C#  ", expected: "C♯", description: "Multiple whitespace around C#" },
    
    // Special characters
    { input: "Bb♭", expected: "B♭♭", description: "Mixed notation - Bb♭" },
    { input: "F#♯", expected: "F♯♯", description: "Mixed notation - F#♯" },
    { input: "C♯#", expected: "C♯♯", description: "Mixed notation - C♯#" },
    { input: "E♭b", expected: "E♭♭", description: "Mixed notation - E♭b" }
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  tests.forEach(test => {
    try {
      const result = accidentalToUnicode(test.input);
      if (result === test.expected) {
        passed++;
      } else {
        failed++;
        failures.push(`${test.description}: "${test.input}" → "${result}" (expected "${test.expected}")`);
      }
    } catch (error) {
      failed++;
      failures.push(`${test.description}: Error - ${error.message}`);
    }
  });

  return TEST_UTILS.createTestResult(passed, failed, failures, tests.length);
}

function runFunctionExistenceTests() {
  if (typeof window === 'undefined') {
    return TEST_UTILS.createTestResult(0, 0, [], 0); // Skip in Node
  }
  const tests = [
    { description: "normalizeChord function exists", test: () => typeof normalizeChord === 'function' },
    { description: "accidentalToUnicode function exists", test: () => typeof accidentalToUnicode === 'function' },
    { description: "normalizeAccList function exists", test: () => typeof normalizeAccList === 'function' },
    { description: "checkAnswer function exists", test: () => typeof checkAnswer === 'function' },
    { description: "askQuestion function exists", test: () => typeof askQuestion === 'function' },
    { description: "initLearningState function exists", test: () => typeof initLearningState === 'function' },
    { description: "saveLearningState function exists", test: () => typeof saveLearningState === 'function' },
    { description: "renderAppLayout function exists", test: () => typeof renderAppLayout === 'function' }
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  tests.forEach(test => {
    try {
      if (test.test()) {
        passed++;
      } else {
        failed++;
        failures.push(`${test.description}: Function not found`);
      }
    } catch (error) {
      failed++;
      failures.push(`${test.description}: Error - ${error.message}`);
    }
  });

  return TEST_UTILS.createTestResult(passed, failed, failures, tests.length);
}

function runAppStateTests() {
  if (typeof window === 'undefined') {
    return TEST_UTILS.createTestResult(0, 0, [], 0); // Skip in Node
  }
  const tests = [
    { description: "learningState object exists", test: () => typeof learningState !== 'undefined' },
    { description: "quizData object exists", test: () => typeof quizData !== 'undefined' },
    { description: "learningPath object exists", test: () => typeof learningPath !== 'undefined' },
    { description: "QUESTION_TYPES object exists", test: () => typeof QUESTION_TYPES !== 'undefined' },
    { description: "MODES object exists", test: () => typeof MODES !== 'undefined' }
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  tests.forEach(test => {
    try {
      if (test.test()) {
        passed++;
      } else {
        failed++;
        failures.push(`${test.description}: Object not found`);
      }
    } catch (error) {
      failed++;
      failures.push(`${test.description}: Error - ${error.message}`);
    }
  });

  return TEST_UTILS.createTestResult(passed, failed, failures, tests.length);
}

// Main test runner
function runAllTests() {
  console.log('🧪 Running Comprehensive Music Theory Tests...\n');
  
  const results = {};
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;

  // Run each test category
  Object.entries(TEST_CATEGORIES).forEach(([key, category]) => {
    try {
      results[key] = category.run();
      totalPassed += results[key].passed;
      totalFailed += results[key].failed;
      totalTests += results[key].total;
      
      if (TEST_CONFIG.showConsoleOutput) {
        TEST_UTILS.logTestResult(category.name, results[key]);
      }
    } catch (error) {
      console.error(`❌ Error running ${category.name}: ${error.message}`);
      results[key] = TEST_UTILS.createTestResult(0, 1, [`Error: ${error.message}`], 1);
      totalFailed++;
      totalTests++;
    }
  });

  // Generate and display results
  displayTestResults(results, totalPassed, totalFailed, totalTests);
  
  return { results, totalPassed, totalFailed, totalTests };
}

// Helper function to copy results to clipboard
function copyResultsToClipboard(results) {
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && navigator.clipboard) {
    const json = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      const button = document.getElementById('copy-json-button');
      if (button) {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy JSON';
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy results:', err);
    });
  }
}

// Display test results
function displayTestResults(results, totalPassed, totalFailed, totalTests) {
  const percentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  const overallStatus = totalFailed === 0 ? 'All tests passed!' : `${totalFailed} test(s) failed.`;
  const headerColor = totalFailed === 0 ? 'background-color: #4CAF50;' : 'background-color: #F44336;';
  
  let resultsHtml = `
    <html>
    <head>
        <title>Test Results</title>
      <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 0; }
          .header { padding: 20px; color: white; text-align: center; }
          .header h1, .header p { margin: 0; }
          .container { padding: 20px; }
          .category { margin-bottom: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .category-header { background-color: #f2f2f2; padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd; }
          .category-header.passed { background-color: #e8f5e9; }
          .category-header.failed { background-color: #ffebee; }
          .test-list { list-style: none; padding: 0; margin: 0; }
          .test-list li { padding: 8px 12px; border-bottom: 1px solid #eee; }
          .test-list li:last-child { border-bottom: none; }
          .failure { color: #D32F2F; }
          .summary { font-weight: bold; }
          .copy-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            font-size: 14px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .copy-button:hover { background-color: #0056b3; }
      </style>
    </head>
    <body>
        <div class="header" style="${headerColor}">
          <h1>${overallStatus}</h1>
          <p>${totalPassed}/${totalTests} passed (${percentage}%)</p>
        </div>
        <button id="copy-json-button" class="copy-button">Copy JSON</button>
        <div class="container">
  `;

  for (const category in results) {
    const categoryInfo = TEST_CATEGORIES[category];
    const isPassed = results[category].failed === 0;
    const emoji = isPassed ? '✅' : '❌';
    
    resultsHtml += `
      <div class="category">
        <div class="category-header ${isPassed ? 'passed' : 'failed'}">
          ${emoji} ${categoryInfo.name} (${results[category].passed}/${results[category].total} passed)
        </div>
        <div class="category-content">
          <p><em>${categoryInfo.description}</em></p>
          <div class="test-result ${isPassed ? 'passed' : 'failed'}">
            <strong>${results[category].passed}</strong> passed, <strong>${results[category].failed}</strong> failed
          </div>
    `;

    if (results[category].failed > 0) {
      resultsHtml += '<div class="failure-list"><strong>Failed Tests:</strong>';
      results[category].failures.forEach(failure => {
        resultsHtml += `<div class="failure-item">❌ ${failure}</div>`;
      });
      resultsHtml += '</div>';
    }

    resultsHtml += '</div></div>';
  }

  resultsHtml += `
      </div>
    </body>
    </html>
  `;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Display results in browser
    if (TEST_CONFIG.openInNewTab) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(resultsHtml);
        newWindow.document.close();
      } else {
        // Fallback: show results in current page if popup is blocked
        showResultsOverlay(resultsHtml);
      }
    } else {
      showResultsOverlay(resultsHtml);
    }
    // Attach event listener to the copy button
    const copyButton = document.getElementById('copy-json-button');
    if (copyButton) {
      copyButton.addEventListener('click', () => copyResultsToClipboard(results));
    }
  }
  // Console summary (always)
  console.log(`\n🧪 Test Summary: ${totalPassed} passed, ${totalFailed} failed out of ${totalTests} total tests`);
  console.log(`Success Rate: ${percentage}%`);
  if (totalFailed > 0) {
    console.log('\n❌ Some tests failed! Check the detailed report.');
  } else {
    console.log('\n✅ All tests passed!');
  }
}

// Show results as overlay
function showResultsOverlay(html) {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'test-results-overlay';
    resultsDiv.innerHTML = html;
    resultsDiv.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: white; z-index: 10000; overflow-y: auto; padding: 20px;
    `;
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close Test Results';
    closeBtn.style.cssText = `
      position: fixed; top: 10px; right: 10px; z-index: 10001;
      background: #dc3545; color: white; border: none; padding: 10px 15px;
      border-radius: 5px; cursor: pointer; font-size: 14px;
    `;
    closeBtn.onclick = () => {
      document.body.removeChild(resultsDiv);
      document.body.removeChild(closeBtn);
    };
    document.body.appendChild(resultsDiv);
    document.body.appendChild(closeBtn);
  }
}

// Keyboard shortcut handler
function setupKeyboardShortcut() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && TEST_CONFIG.keyboardShortcut) {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+Q (or Cmd+Shift+Q on Mac) - Test shortcut
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Q') {
        e.preventDefault();
        console.clear();
        runAllTests();
      }
    });
  }
}

// Auto-run on page load if configured
if (typeof window !== 'undefined' && typeof document !== 'undefined' && TEST_CONFIG.autoRun) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      console.clear();
      runAllTests();
    }, 1000);
  });
}

// Setup keyboard shortcut
setupKeyboardShortcut();

// Export for global access (browser only)
if (typeof window !== 'undefined') {
  window.MusicTheoryTests = {
    runAllTests,
    runChordNormalizationTests,
    runAccidentalNormalizationTests,
    runFunctionExistenceTests,
    runAppStateTests,
    TEST_CONFIG,
    TEST_CATEGORIES
  };
}

if (typeof window !== 'undefined') {
  console.log('🧪 Music Theory Test Suite loaded! Press Ctrl+Shift+Q (or Cmd+Shift+Q) to run tests.');
}

export function runTests() {
  // Run all core test categories and return a summary object
  const results = {};
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  for (const [key, category] of Object.entries(TEST_CATEGORIES)) {
    const result = category.run();
    results[key] = result;
    totalPassed += result.passed;
    totalFailed += result.failed;
    totalTests += result.total;
  }
  return {
    passed: totalPassed,
    failed: totalFailed,
    total: totalTests,
    categories: results
  };
} 