// Unit test coordinator
export async function runUnitTests() {
  console.log('  🔧 Core functions...');
  const coreResults = await import('./core-functions.test.js').then(m => m.runTests());
  console.log('  🎵 Chord normalization...');
  const chordResults = await import('./chord-normalization.test.js').then(m => m.runTests());
  // Combine results
  const totalPassed = coreResults.passed + chordResults.passed;
  const totalFailed = coreResults.failed + chordResults.failed;
  const totalTests = totalPassed + totalFailed;
  return {
    passed: totalPassed,
    failed: totalFailed,
    total: totalTests,
    categories: {
      core: coreResults,
      chords: chordResults
    }
  };
} 