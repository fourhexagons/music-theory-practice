/**
 * Chord Normalization Edge Cases Test Suite
 * 
 * This file contains specific test cases for chord normalization edge cases
 * that were previously failing. These tests serve as a regression suite
 * to ensure these cases remain fixed.
 */

// Make the test function available globally
window.runChordNormalizationEdgeCases = function() {
  const tests = [
    // Major 7th notation variations
    { input: "CM7", expected: "Cmaj7", description: "Major 7th - M7 notation" },
    { input: "CΔ", expected: "Cmaj7", description: "Major 7th - Delta symbol (U+0394)" },
    { input: "C∆", expected: "Cmaj7", description: "Major 7th - Delta symbol (U+2206)" },
    { input: "BbM7", expected: "B♭maj7", description: "Major 7th with flat - M7 notation" },
    { input: "BbΔ", expected: "B♭maj7", description: "Major 7th with flat - Delta symbol" },
    
    // Half-diminished variations
    { input: "Ehalfdim", expected: "Em7♭5", description: "Half diminished - halfdim text" },
    { input: "Ehalf-dim", expected: "Em7♭5", description: "Half diminished - half-dim text" },
    { input: "Em7b5", expected: "Em7♭5", description: "Half diminished - m7b5 notation" },
    { input: "Emin7b5", expected: "Em7♭5", description: "Half diminished - min7b5 notation" },
    { input: "Emin7♭5", expected: "Em7♭5", description: "Half diminished - min7♭5 notation" },
    { input: "Eminor7b5", expected: "Em7♭5", description: "Half diminished - minor7b5 notation" },
    { input: "Eminor7♭5", expected: "Em7♭5", description: "Half diminished - minor7♭5 notation" },
    { input: "Eø", expected: "Em7♭5", description: "Half diminished - ø symbol" },
    
    // Mixed case tests
    { input: "CMAJ7", expected: "Cmaj7", description: "Major 7th - uppercase MAJ7" },
    { input: "Cmaj7", expected: "Cmaj7", description: "Major 7th - lowercase maj7" },
    { input: "CΔΔΔ", expected: "Cmaj7", description: "Major 7th - multiple deltas" },
    
    // Edge cases with accidentals
    { input: "C#M7", expected: "C♯maj7", description: "Major 7th with sharp - M7 notation" },
    { input: "C#Δ", expected: "C♯maj7", description: "Major 7th with sharp - Delta symbol" },
    { input: "BbHALFDIM", expected: "B♭m7♭5", description: "Half diminished with flat - uppercase" }
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  tests.forEach(test => {
    try {
      const result = normalizeChord(test.input);
      if (result === test.expected) {
        passed++;
        console.log(`✅ Passed: ${test.description}`);
      } else {
        failed++;
        const message = `${test.description}: "${test.input}" → "${result}" (expected "${test.expected}")`;
        console.error(`❌ Failed: ${message}`);
        failures.push(message);
      }
    } catch (error) {
      failed++;
      const message = `${test.description}: Error - ${error.message}`;
      console.error(`❌ Failed: ${message}`);
      failures.push(message);
    }
  });

  return {
    category: "Chord Normalization Edge Cases",
    passed,
    failed,
    failures,
    total: tests.length
  };
}; 