console.log('=== Testing Seventh Chord Spelling Validation ===');

// Test data for C major, 2nd degree seventh chord
const testData = window.quizData.C.seventhSpelling[2];
console.log('Expected data:', testData);

// Simulate user input
const userInput = 'D F A C';
console.log('User input:', userInput);

// Process the expected answer
const correctSpelling = testData.map(n => n.toUpperCase()).join('');
console.log('Correct spelling (processed):', correctSpelling);

// Process the user input the same way the validation does
const userSpelling = userInput.trim().split(/\s+/).map(window.accidentalToUnicode).join('').toUpperCase();
console.log('User spelling (processed):', userSpelling);

// Check if they match
const isMatch = correctSpelling === userSpelling;
console.log('Match:', isMatch);

// Additional debugging
console.log('--- Additional Debug Info ---');
console.log('accidentalToUnicode function exists:', typeof window.accidentalToUnicode);
console.log('Individual note processing:');
userInput.trim().split(/\s+/).forEach((note, index) => {
    const processed = window.accidentalToUnicode(note);
    console.log(`  ${note} -> ${processed} (${processed.charCodeAt(0)})`);
});

console.log('=== End Test ===');
