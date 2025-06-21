/**
 * Music Theory Practice - Comprehensive Test Suite
 * 
 * This file contains all tests for the music theory app.
 * Run tests by pressing Ctrl+Shift+Q (or Cmd+Shift+Q on Mac)
 */

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

// Display test results
function displayTestResults(results, totalPassed, totalFailed, totalTests) {
  const successRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  
  // Generate HTML report
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Music Theory Test Results</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; margin-bottom: 30px; }
        .summary { background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
        .summary.failed { background: #ffe8e8; }
        .category { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .category-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd; font-weight: bold; }
        .category-header.passed { background: #d4edda; color: #155724; }
        .category-header.failed { background: #f8d7da; color: #721c24; }
        .category-content { padding: 20px; }
        .test-result { margin: 5px 0; padding: 8px; border-radius: 4px; }
        .test-result.passed { background: #d1ecf1; color: #0c5460; }
        .test-result.failed { background: #f8d7da; color: #721c24; }
        .failure-list { background: #fff3cd; padding: 15px; border-radius: 4px; margin-top: 10px; }
        .failure-item { margin: 5px 0; padding: 5px; background: #ffeaa7; border-radius: 3px; }
        .timestamp { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎵 Music Theory Test Results</h1>
        
        <div class="summary ${totalFailed > 0 ? 'failed' : ''}">
          <h2>${totalFailed > 0 ? '❌' : '✅'} Overall Results</h2>
          <p><strong>${totalPassed}</strong> passed, <strong>${totalFailed}</strong> failed out of <strong>${totalTests}</strong> total tests</p>
          <p>Success Rate: <strong>${successRate}%</strong></p>
        </div>
  `;

  // Add each category
  Object.entries(results).forEach(([category, result]) => {
    const categoryInfo = TEST_CATEGORIES[category];
    const isPassed = result.failed === 0;
    const emoji = isPassed ? '✅' : '❌';
    
    html += `
      <div class="category">
        <div class="category-header ${isPassed ? 'passed' : 'failed'}">
          ${emoji} ${categoryInfo.name} (${result.passed}/${result.total} passed)
        </div>
        <div class="category-content">
          <p><em>${categoryInfo.description}</em></p>
          <div class="test-result ${isPassed ? 'passed' : 'failed'}">
            <strong>${result.passed}</strong> passed, <strong>${result.failed}</strong> failed
          </div>
    `;

    if (result.failed > 0) {
      html += '<div class="failure-list"><strong>Failed Tests:</strong>';
      result.failures.forEach(failure => {
        html += `<div class="failure-item">❌ ${failure}</div>`;
      });
      html += '</div>';
    }

    html += '</div></div>';
  });

  html += `
        <div class="timestamp">
          Tests run at ${new Date().toLocaleString()}
        </div>
      </div>
    </body>
    </html>
  `;

  // Display results
  if (TEST_CONFIG.openInNewTab) {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    } else {
      // Fallback: show results in current page if popup is blocked
      showResultsOverlay(html);
    }
  } else {
    showResultsOverlay(html);
  }

  // Console summary
  console.log(`\n🧪 Test Summary: ${totalPassed} passed, ${totalFailed} failed out of ${totalTests} total tests`);
  console.log(`Success Rate: ${successRate}%`);
  
  if (totalFailed > 0) {
    console.log('\n❌ Some tests failed! Check the detailed report.');
  } else {
    console.log('\n✅ All tests passed!');
  }
}

// Show results as overlay
function showResultsOverlay(html) {
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

// Keyboard shortcut handler
function setupKeyboardShortcut() {
  if (!TEST_CONFIG.keyboardShortcut) return;
  
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+Q (or Cmd+Shift+Q on Mac) - Test shortcut
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Q') {
      e.preventDefault();
      console.clear();
      runAllTests();
    }
  });
}

// Auto-run on page load if configured
if (TEST_CONFIG.autoRun) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      console.clear();
      runAllTests();
    }, 1000);
  });
}

// Setup keyboard shortcut
setupKeyboardShortcut();

// Export for global access
window.MusicTheoryTests = {
  runAllTests,
  runChordNormalizationTests,
  runAccidentalNormalizationTests,
  runFunctionExistenceTests,
  runAppStateTests,
  TEST_CONFIG,
  TEST_CATEGORIES
};

console.log('🧪 Music Theory Test Suite loaded! Press Ctrl+Shift+Q (or Cmd+Shift+Q) to run tests.'); 