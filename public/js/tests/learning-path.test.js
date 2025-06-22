/**
 * Learning Path Progression Test
 * 
 * This test simulates a user answering all questions correctly and tracks
 * the progression through the learning path to ensure it follows the intended sequence.
 */

// Import the learning path data and state management
const LEARNING_PATH_DATA = {
  QUESTION_TYPES: {
    ACCIDENTALS_COUNT: 'accCount',
    ACCIDENTALS_NAMES: 'accNotes',
    SCALE_SPELLING: 'scale',
    TRIADS: 'triads',
    SEVENTHS: 'sevenths',
    SEVENTH_SPELLING: 'seventhSpelling'
  },
  
  MODES: {
    LINEAR: 'linear',
    RANDOM_KEYS_LINEAR_CHAPTERS: 'random_keys_linear_chapters',
    RANDOM_ALL: 'random_all',
    COMPLETE: 'complete'
  },
  
  CHAPTERS: {
    ACCIDENTALS_COUNT: { id: 'accCount', name: 'Accidentals Count' },
    ACCIDENTALS_NAMES: { id: 'accNotes', name: 'Accidentals Naming' },
    SCALE_SPELLING: { id: 'scale', name: 'Scale Spelling' },
    TRIADS: { id: 'triads', name: 'Triads' },
    SEVENTHS: { id: 'sevenths', name: 'Sevenths' },
    SEVENTH_SPELLING: { id: 'seventhSpelling', name: 'Seventh Spelling' }
  },
  
  CORE_CHAPTERS: [
    { id: 'accCount', name: 'Accidentals Count' },
    { id: 'accNotes', name: 'Accidentals Naming' },
    { id: 'scale', name: 'Scale Spelling' },
    { id: 'triads', name: 'Triads' }
  ],
  
  ALL_CHAPTERS: [
    { id: 'accCount', name: 'Accidentals Count' },
    { id: 'accNotes', name: 'Accidentals Naming' },
    { id: 'scale', name: 'Scale Spelling' },
    { id: 'triads', name: 'Triads' },
    { id: 'sevenths', name: 'Sevenths' },
    { id: 'seventhSpelling', name: 'Seventh Spelling' }
  ],
  
  learningPath: [
    { name: '1. Introduction', keys: ['C'], mode: 'linear', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' }
    ], requiredStreak: 3 },
    { name: '2. Level 1a Sharps', keys: ['G', 'D', 'A'], mode: 'linear', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' }
    ], requiredStreak: 3 },
    { name: '3. Level 1b Sharps', keys: ['G', 'D', 'A'], mode: 'random_keys_linear_chapters', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' }
    ], requiredStreak: 5 },
    { name: '4. Level 1a Flats', keys: ['F', 'B♭', 'E♭'], mode: 'linear', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' }
    ], requiredStreak: 3 },
    { name: '5. Level 1b Flats', keys: ['F', 'B♭', 'E♭'], mode: 'random_keys_linear_chapters', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' }
    ], requiredStreak: 5 },
    { name: '6. Level 2a Sharps', keys: ['E', 'B', 'F♯'], mode: 'linear', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' }
    ], requiredStreak: 3 },
    { name: '7. Level 2b Sharps', keys: ['E', 'B', 'F♯'], mode: 'random_keys_linear_chapters', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' }
    ], requiredStreak: 5 },
    { name: '8. Level 2a Flats', keys: ['A♭', 'D♭', 'G♭'], mode: 'linear', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' }
    ], requiredStreak: 3 },
    { name: '9. Level 2b Flats', keys: ['A♭', 'D♭', 'G♭'], mode: 'random_keys_linear_chapters', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' }
    ], requiredStreak: 5 },
    { name: '10. Level 3 Sharps', keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F♯'], mode: 'random_all', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' },
      { id: 'sevenths', name: 'Sevenths' },
      { id: 'seventhSpelling', name: 'Seventh Spelling' }
    ], requiredStreak: 5 },
    { name: '11. Level 3 Flats', keys: ['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'], mode: 'random_all', chapters: [
      { id: 'accCount', name: 'Accidentals Count' },
      { id: 'accNotes', name: 'Accidentals Naming' },
      { id: 'scale', name: 'Scale Spelling' },
      { id: 'triads', name: 'Triads' },
      { id: 'sevenths', name: 'Sevenths' },
      { id: 'seventhSpelling', name: 'Seventh Spelling' }
    ], requiredStreak: 5 },
    { name: 'Complete!', keys: [], mode: 'complete', chapters: [], requiredStreak: Infinity }
  ]
};

// Mock quiz data for testing
const MOCK_QUIZ_DATA = {
  C: { accidentals: 0, notes: [], scale: ["C","D","E","F","G","A","B"], triads: {2:"Dm",3:"Em",4:"F",5:"G",6:"Am",7:"B˚"} },
  G: { accidentals: 1, notes: ["F#"], scale: ["G","A","B","C","D","E","F#"], triads: {2:"Am",3:"Bm",4:"C",5:"D",6:"Em",7:"F#˚"} },
  D: { accidentals: 2, notes: ["F#","C#"], scale: ["D","E","F#","G","A","B","C#"], triads: {2:"Em",3:"F#m",4:"G",5:"A",6:"Bm",7:"C#˚"} },
  A: { accidentals: 3, notes: ["F#","C#","G#"], scale: ["A","B","C#","D","E","F#","G#"], triads: {2:"Bm",3:"C#m",4:"D",5:"E",6:"F#m",7:"G#˚"} },
  F: { accidentals: 1, notes: ["B♭"], scale: ["F","G","A","B♭","C","D","E"], triads: {2:"Gm",3:"Am",4:"B♭",5:"C",6:"Dm",7:"E˚"} },
  "B♭": { accidentals: 2, notes: ["B♭","E♭"], scale: ["B♭","C","D","E♭","F","G","A"], triads: {2:"Cm",3:"Dm",4:"E♭",5:"F",6:"Gm",7:"A˚"} },
  "E♭": { accidentals: 3, notes: ["B♭","E♭","A♭"], scale: ["E♭","F","G","A♭","B♭","C","D"], triads: {2:"Fm",3:"Gm",4:"A♭",5:"B♭",6:"Cm",7:"D˚"} }
};

/**
 * Simulates the learning path progression
 */
function simulateLearningPath() {
  const results = {
    path: [],
    summary: [],
    json: {
      totalQuestions: 0,
      levelProgression: [],
      errors: []
    }
  };
  
  // Initialize state
  let state = {
    currentLevelIndex: 0,
    currentChapterIndex: 0,
    currentKeyIndex: 0,
    correctAnswerStreak: 0,
    usedDegrees: [],
    correctChordAnswersForCurrentKey: 0
  };
  
  let questionCount = 0;
  const maxQuestions = 1000; // Safety limit
  
  while (state.currentLevelIndex < LEARNING_PATH_DATA.learningPath.length - 1 && questionCount < maxQuestions) {
    const level = LEARNING_PATH_DATA.learningPath[state.currentLevelIndex];
    const nextLevel = LEARNING_PATH_DATA.learningPath[state.currentLevelIndex + 1];
    
    if (level.mode === 'complete') {
      break;
    }
    
    // Determine current key and chapter
    let key, chapter;
    
    if (level.mode === 'linear') {
      key = level.keys[state.currentKeyIndex];
      chapter = level.chapters[state.currentChapterIndex];
    } else if (level.mode === 'random_keys_linear_chapters') {
      // For testing, we'll use the first key to make it predictable
      key = level.keys[0];
      chapter = level.chapters[state.currentChapterIndex];
    } else if (level.mode === 'random_all') {
      // For testing, we'll use the first key and first chapter to make it predictable
      key = level.keys[0];
      chapter = level.chapters[0];
    }
    
    // Skip accidentals naming for C major
    if (key === 'C' && chapter.id === 'accNotes') {
      state.currentChapterIndex++;
      continue;
    }
    
    // Generate question text
    let questionText = '';
    switch (chapter.id) {
      case 'accCount':
        questionText = `How many accidentals are in ${key} major?`;
        break;
      case 'accNotes':
        questionText = `Name the accidentals in ${key} major.`;
        break;
      case 'scale':
        questionText = `Spell the ${key} major scale.`;
        break;
      case 'triads':
        questionText = `Name the ${getOrdinal(state.currentChapterIndex + 1)} triad in ${key} major.`;
        break;
    }
    
    // Record the question
    questionCount++;
    const questionRecord = {
      questionNumber: questionCount,
      level: level.name,
      levelIndex: state.currentLevelIndex,
      key: key,
      chapter: chapter.name,
      chapterIndex: state.currentChapterIndex,
      keyIndex: state.currentKeyIndex,
      mode: level.mode,
      question: questionText,
      streak: state.correctAnswerStreak
    };
    
    results.path.push(questionRecord);
    
    // Simulate correct answer
    state.correctAnswerStreak++;
    
    // Handle progression based on mode
    if (level.mode === 'linear') {
      if (chapter.id === 'triads') {
        state.correctChordAnswersForCurrentKey++;
        
        if (state.correctChordAnswersForCurrentKey >= 3) {
          // Move to next key
          state.correctChordAnswersForCurrentKey = 0;
          state.usedDegrees = [];
          state.currentKeyIndex++;
          
          if (state.currentKeyIndex >= level.keys.length) {
            // Move to next level
            state.currentLevelIndex++;
            state.currentChapterIndex = 0;
            state.currentKeyIndex = 0;
            state.correctAnswerStreak = 0;
            
            results.summary.push(`✅ Completed ${level.name} -> ${nextLevel.name}`);
            results.json.levelProgression.push({
              from: level.name,
              to: nextLevel.name,
              questionsInLevel: questionCount - (results.json.totalQuestions || 0)
            });
            results.json.totalQuestions = questionCount;
          } else {
            // Reset to first chapter for new key
            state.currentChapterIndex = 0;
          }
        }
      } else {
        // Not a chord question - advance normally
        state.currentChapterIndex++;
        if (state.currentChapterIndex >= level.chapters.length) {
          state.currentChapterIndex = 0;
        }
      }
    } else {
      // Non-linear modes use streak-based progression
      if (state.correctAnswerStreak >= level.requiredStreak) {
        state.currentLevelIndex++;
        state.currentChapterIndex = 0;
        state.currentKeyIndex = 0;
        state.correctAnswerStreak = 0;
        
        results.summary.push(`✅ Completed ${level.name} -> ${nextLevel.name}`);
        results.json.levelProgression.push({
          from: level.name,
          to: nextLevel.name,
          questionsInLevel: questionCount - (results.json.totalQuestions || 0)
        });
        results.json.totalQuestions = questionCount;
      } else {
        state.currentChapterIndex++;
        if (state.currentChapterIndex >= level.chapters.length) {
          state.currentChapterIndex = 0;
        }
      }
    }
  }
  
  return results;
}

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Run the test
function runLearningPathTest() {
  console.log('🎯 Learning Path Progression Test');
  console.log('================================');
  
  const results = simulateLearningPath();
  
  console.log('\n📊 SUMMARY:');
  console.log('===========');
  results.summary.forEach(summary => console.log(summary));
  
  console.log('\n🔍 DETAILED PATH (First 20 questions):');
  console.log('=====================================');
  results.path.slice(0, 20).forEach((q, i) => {
    console.log(`${i + 1}. ${q.level} | ${q.key} | ${q.chapter} | Q: ${q.question}`);
  });
  
  if (results.path.length > 20) {
    console.log(`... and ${results.path.length - 20} more questions`);
  }
  
  console.log('\n📋 JSON OUTPUT:');
  console.log('==============');
  console.log(JSON.stringify(results.json, null, 2));
  
  console.log(`\n✅ Total questions simulated: ${results.json.totalQuestions}`);
  console.log(`✅ Levels completed: ${results.json.levelProgression.length}`);
  
  return results;
}

// Make the test available globally
window.runLearningPathTest = runLearningPathTest; 