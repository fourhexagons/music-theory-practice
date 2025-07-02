// Test script to simulate "Full Random" behavior and identify patterns
// This simulates the exact logic used in startAdvancedPractice('random_all')

// Simulate the data structures
const QUESTION_TYPES = {
  ACCIDENTALS_COUNT: 'accCount',
  ACCIDENTALS_NAMES: 'accNotes', 
  SCALE_SPELLING: 'scale',
  TRIADS: 'triads',
  SEVENTHS: 'sevenths',
  SEVENTH_SPELLING: 'seventhSpelling'
};

const CHAPTERS = {
  ACCIDENTALS_COUNT: { id: QUESTION_TYPES.ACCIDENTALS_COUNT, name: 'Accidentals Count' },
  ACCIDENTALS_NAMES: { id: QUESTION_TYPES.ACCIDENTALS_NAMES, name: 'Accidentals Naming' },
  SCALE_SPELLING: { id: QUESTION_TYPES.SCALE_SPELLING, name: 'Scale Spelling' },
  TRIADS: { id: QUESTION_TYPES.TRIADS, name: 'Triads' },
  SEVENTHS: { id: QUESTION_TYPES.SEVENTHS, name: 'Sevenths' },
  SEVENTH_SPELLING: { id: QUESTION_TYPES.SEVENTH_SPELLING, name: 'Seventh Spelling' }
};

// All keys with their accidental counts
const quizData = {
  'C': { accidentals: 0 },    // C major has NO accidentals
  'G': { accidentals: 1 },    'D': { accidentals: 2 },    'A': { accidentals: 3 },
  'E': { accidentals: 4 },    'B': { accidentals: 5 },    'F#': { accidentals: 6 },
  'C#': { accidentals: 7 },   'F': { accidentals: 1 },    'Bb': { accidentals: 2 },
  'Eb': { accidentals: 3 },   'Ab': { accidentals: 4 },   'Db': { accidentals: 5 },
  'Gb': { accidentals: 6 },   'Cb': { accidentals: 7 }
};

// Simulate the filtering logic
function getAvailableChapters() {
  return Object.values(CHAPTERS).filter(chapter => 
    chapter.id !== QUESTION_TYPES.ACCIDENTALS_NAMES &&     // Excluded: A/B pairing
    chapter.id !== QUESTION_TYPES.SEVENTH_SPELLING          // Excluded: sevenths_only mode
  );
}

// Simulate random selection
function simulateFullRandomSession(numQuestions = 20) {
  const availableChapters = getAvailableChapters();
  const allKeys = Object.keys(quizData);
  const results = [];
  const stats = { accCount: 0, scale: 0, triads: 0, sevenths: 0, accNotes: 0 };
  
  console.log(`🎯 Simulating Full Random Session (${numQuestions} questions)`);
  console.log(`Available chapters: [${availableChapters.map(c => c.id).join(', ')}]`);
  console.log(`Available keys: [${allKeys.join(', ')}]\n`);
  
  for (let i = 0; i < numQuestions; i++) {
    // Step 1: Random chapter selection
    const randomChapter = availableChapters[Math.floor(Math.random() * availableChapters.length)];
    
    // Step 2: Random key selection  
    const selectedKey = allKeys[Math.floor(Math.random() * allKeys.length)];
    
    // Step 3: Question generation
    const questionType = randomChapter.id;
    let nextQuestionType = null;
    
    // Step 4: A/B pairing logic simulation
    if (questionType === 'accCount' && quizData[selectedKey].accidentals > 0) {
      nextQuestionType = 'accNotes';  // Will be asked next
    }
    
    results.push({
      question: i + 1,
      type: questionType,
      key: selectedKey,
      hasAccidentals: quizData[selectedKey].accidentals > 0,
      nextType: nextQuestionType
    });
    
    stats[questionType]++;
    
    // If this generates an accNotes follow-up, count it too
    if (nextQuestionType) {
      stats[nextQuestionType]++;
      i++; // This counts as 2 questions
      results.push({
        question: i + 1,
        type: nextQuestionType,
        key: selectedKey,
        hasAccidentals: true,
        nextType: null,
        isFollowUp: true
      });
    }
  }
  
  return { results, stats };
}

// Run simulation
console.log('🔬 FULL RANDOM PATTERN ANALYSIS');
console.log('='.repeat(50));

const { results, stats } = simulateFullRandomSession(20);

// Display results
console.log('📋 Question Sequence:');
results.forEach(q => {
  const marker = q.isFollowUp ? '  ↳' : `${q.question}.`;
  const accInfo = q.hasAccidentals ? '(has accidentals)' : '(NO accidentals)';
  console.log(`${marker} ${q.type} in ${q.key} ${accInfo}`);
});

console.log('\n📊 Question Type Distribution:');
const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
Object.entries(stats).forEach(([type, count]) => {
  const percentage = total > 0 ? (count / total * 100).toFixed(1) : '0.0';
  console.log(`   ${type}: ${count} (${percentage}%)`);
});

console.log(`\n🎯 Total Questions Generated: ${total}`);
console.log(`🎯 Accidentals Pairing Triggered: ${stats.accNotes} times`);

// Analysis
const accCountRatio = stats.accCount / (stats.accCount + stats.scale + stats.triads + stats.sevenths);
console.log(`\n📈 Analysis:`);
console.log(`   Pure AccCount Ratio: ${(accCountRatio * 100).toFixed(1)}% (expected: 25%)`);
console.log(`   A/B Pairs Generated: ${stats.accNotes}`);
console.log(`   C Major Effects: Check if accCount + C major creates bias patterns`); 