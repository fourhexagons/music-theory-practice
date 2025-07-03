/**
 * Music Theory Practice - Learning State Management
 * 
 * Manages the application's learning state including progress, current questions,
 * and user session data.
 * 
 * 🚨 CRITICAL WARNING: DO NOT MODIFY LEARNING PATH LOGIC 🚨
 * 
 * This file contains the core learning path progression logic that is WORKING CORRECTLY.
 * Any modifications to the following functions require explicit permission:
 * - advanceLearningPath()
 * - getCurrentChapter()
 * - getCurrentKey()
 * - getCurrentGroup()
 * - recordCorrectAnswer()
 * - recordIncorrectAnswer()
 * 
 * See docs/LEARNING_PATH_PROTECTION.md for the mandatory protocol.
 * 

 */

/**
 * Learning state object containing all application state
 */
const learningState = {
  currentGroup: 0,
  currentKeyIndex: 0,
  currentChapterIndex: 0,
  mode: window.MODES ? window.MODES.LINEAR : 'linear',
  currentQuestion: null,
  correctAnswersInChapter: 0,
  requiredAnswersPerChapter: 3,
  usedDegrees: [],
  lastAnswerIncorrect: false,
  // Properties expected by tests
  currentLevelIndex: 0,
  correctAnswerStreak: 0,
  correctChordAnswersForCurrentKey: 0,
  // State for accidentals pairing
  accidentalsPairState: {
    inProgress: false,
    currentKey: null,
    countAnswered: false
  },
  // State for key sequence management in island levels
  keySequenceState: {
    inProgress: false,
    currentSequenceKey: null,
    currentSequencePhase: 'accCount', // 'accCount', 'accNotes', 'scale', 'triads'
    correctTriadsInCurrentKey: 0,
    usedKeysInCurrentCycle: [],
    lastCompletedKey: null
  },
  // Reset advanced mode flags
  isAdvancedMode: false,
  advancedModeType: null,
  customGroup: null,
  // Combination prevention for b-levels
  usedCombinations: [] // Array of "key-degree" strings to prevent repeats
};
window.learningState = learningState;

/**
 * Validates the learning state object and resets if invalid
 */
function validateLearningState() {
  let valid = true;
  // Check for required properties and types
  const requiredProps = [
    'currentGroup', 'currentKeyIndex', 'currentChapterIndex', 'mode',
    'currentQuestion', 'correctAnswersInChapter', 'requiredAnswersPerChapter',
    'usedDegrees', 'lastAnswerIncorrect', 'accidentalsPairState', 'keySequenceState'
  ];
  for (const prop of requiredProps) {
    if (!(prop in learningState)) {
      valid = false;
      break;
    }
  }
  // Check for valid indices and types
  if (
    typeof learningState.currentGroup !== 'number' ||
    typeof learningState.currentKeyIndex !== 'number' ||
    typeof learningState.currentChapterIndex !== 'number' ||
    !Array.isArray(learningState.usedDegrees) ||
    typeof learningState.accidentalsPairState !== 'object' ||
    typeof learningState.keySequenceState !== 'object'
  ) {
    valid = false;
  }
  // Check for out-of-bounds indices
  if (window.learningPath) {
    if (
      learningState.currentGroup < 0 ||
      learningState.currentGroup >= window.learningPath.length ||
      learningState.currentKeyIndex < 0 ||
      (window.learningPath[learningState.currentGroup] && learningState.currentKeyIndex >= window.learningPath[learningState.currentGroup].keys.length)
    ) {
      valid = false;
    }
  }
  if (!valid) {
    console.warn('Invalid or corrupted learning state detected. Resetting to defaults.');
    resetLearningState();
    saveLearningState();
  }
}

/**
 * Initializes the learning state from localStorage or defaults
 */
function initLearningState() {
  const saved = localStorage.getItem('learningState');
  if (saved) {
    try {
      Object.assign(learningState, JSON.parse(saved));
    } catch (error) {
      console.error('Error parsing saved state:', error);
      resetLearningState();
    }
  }
  validateLearningState();
  // Reset transient states that shouldn't persist across sessions
  learningState.lastAnswerIncorrect = false;
  if (!Array.isArray(learningState.usedDegrees)) {
    learningState.usedDegrees = [];
  }
}
window.initLearningState = initLearningState;

/**
 * Resets the learning state to initial values
 */
function resetLearningState() {
  Object.assign(learningState, {
    currentGroup: 0,
    currentKeyIndex: 0,
    currentChapterIndex: 0,
    correctAnswersInChapter: 0,
    usedDegrees: [],
    mode: window.MODES ? window.MODES.LINEAR : 'linear',
    lastAnswerIncorrect: false,
    // Properties expected by tests
    currentLevelIndex: 0,
    correctAnswerStreak: 0,
    correctChordAnswersForCurrentKey: 0,
    // Reset advanced mode flags
    isAdvancedMode: false,
    advancedModeType: null,
    currentQuestion: null,
    accidentalsPairState: {
      inProgress: false,
      currentKey: null,
      countAnswered: false
    },
    keySequenceState: {
      inProgress: false,
      currentSequenceKey: null,
      currentSequencePhase: 'accCount',
      correctTriadsInCurrentKey: 0,
      usedKeysInCurrentCycle: [],
      lastCompletedKey: null
    },
    customGroup: null,
    // Combination prevention for b-levels
    usedCombinations: [] // Array of "key-degree" strings to prevent repeats
  });
}
window.resetLearningState = resetLearningState;

/**
 * Saves the current learning state to localStorage
 */
function saveLearningState() {
  try {
    localStorage.setItem('learningState', JSON.stringify(learningState));
  } catch (error) {
    console.error('Error saving state:', error);
  }
}
window.saveLearningState = saveLearningState;

/**
 * Gets the current learning state.
 * @returns {Object} - The current learningState object.
 */
function getLearningState() {
  return learningState;
}
window.getLearningState = getLearningState;

/**
 * Gets the current learning group
 * @returns {Object} - The current group configuration
 */
function getCurrentGroup() {
  // If there's a custom group (from difficulty selection), use that
  if (learningState.customGroup) {
    return learningState.customGroup;
  }
  
  // Otherwise, use the standard learning path
  return window.learningPath[learningState.currentGroup];
}
window.getCurrentGroup = getCurrentGroup;

/**
 * Gets the current key being practiced
 * @param {string} mode - The current practice mode
 * @returns {string} - The current key
 */
function getCurrentKey(mode) {
  const group = getCurrentGroup();
  
  // Handle A-B pairing for accidentals (preserves existing functionality)
  if (learningState.accidentalsPairState && learningState.accidentalsPairState.inProgress) {
    return learningState.accidentalsPairState.currentKey;
  }
  
  // Handle key sequences for island levels (new functionality)
  if (mode === window.MODES.RANDOM_KEYS_LINEAR_CHAPTERS && learningState.customGroup) {
    return getKeySequenceKey(group);
  }
  
  // Handle other random modes (existing functionality)
  if (mode === window.MODES.NAMING_TRIADS || mode.startsWith('advanced') || mode === 'spelling_sevenths') {
    const selectedKey = group.keys[Math.floor(Math.random() * group.keys.length)];
    return selectedKey;
  }
  
  // Linear mode (existing functionality)
  return group.keys[learningState.currentKeyIndex];
}
window.getCurrentKey = getCurrentKey;

/**
 * Gets the current key for sequence-based island levels
 * Implements mini-sequence logic: same key for accCount + accNotes + scale + 3 triads
 * @param {Object} group - The current group configuration
 * @returns {string} - The current sequence key
 */
function getKeySequenceKey(group) {
  const sequenceState = learningState.keySequenceState;
  
  // If a sequence is in progress, return the locked key
  if (sequenceState.inProgress && sequenceState.currentSequenceKey) {
    return sequenceState.currentSequenceKey;
  }
  
  // Start a new sequence - select a random key with cycling logic
  return startNewKeySequence(group);
}

/**
 * Starts a new key sequence for island levels
 * @param {Object} group - The current group configuration
 * @returns {string} - The newly selected key
 */
function startNewKeySequence(group) {
  const sequenceState = learningState.keySequenceState;
  
  // Get available keys (not yet used in current cycle)
  let availableKeys = group.keys.filter(key => !sequenceState.usedKeysInCurrentCycle.includes(key));
  
  // If all keys have been used, start a new cycle
  if (availableKeys.length === 0) {
    sequenceState.usedKeysInCurrentCycle = [];
    availableKeys = group.keys.slice(); // Copy all keys
    
    // Apply anti-repetition weighting: remove last completed key if possible
    if (sequenceState.lastCompletedKey && availableKeys.length > 1) {
      availableKeys = availableKeys.filter(key => key !== sequenceState.lastCompletedKey);
    }
  }
  
  // Randomly select a key from available keys
  const selectedKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
  
  // Initialize sequence state
  sequenceState.inProgress = true;
  sequenceState.currentSequenceKey = selectedKey;
  sequenceState.currentSequencePhase = 'accCount';
  sequenceState.correctTriadsInCurrentKey = 0;
  sequenceState.usedKeysInCurrentCycle.push(selectedKey);
  
  console.log('🎹 KEY SEQUENCE: Started new sequence', {
    selectedKey,
    availableKeys,
    usedInCycle: sequenceState.usedKeysInCurrentCycle,
    lastCompleted: sequenceState.lastCompletedKey
  });
  
  return selectedKey;
}

/**
 * Advances the key sequence phase after a correct answer
 * @param {string} currentChapterId - The chapter that was just completed
 * @returns {boolean} - True if sequence is complete, false if continuing
 */
function advanceKeySequence(currentChapterId) {
  const sequenceState = learningState.keySequenceState;
  
  if (!sequenceState.inProgress) {
    return false;
  }
  
  console.log('🎹 KEY SEQUENCE: Advancing sequence', {
    currentChapter: currentChapterId,
    currentPhase: sequenceState.currentSequencePhase,
    currentKey: sequenceState.currentSequenceKey,
    triadsCount: sequenceState.correctTriadsInCurrentKey
  });
  
  // Handle triad progression (need 3 correct triads)
  if (currentChapterId === 'triads') {
    sequenceState.correctTriadsInCurrentKey++;
    
    // Continue with triads until we have 3 correct
    if (sequenceState.correctTriadsInCurrentKey < 3) {
      console.log('🎹 KEY SEQUENCE: Continuing triads', {
        count: sequenceState.correctTriadsInCurrentKey,
        needed: 3
      });
      return false; // Continue with more triads
    }
    
    // 3 triads complete - end sequence
    return completeKeySequence();
  }
  
  // Handle other chapter progression
  switch (sequenceState.currentSequencePhase) {
    case 'accCount':
      sequenceState.currentSequencePhase = 'accNotes';
      break;
    case 'accNotes':
      sequenceState.currentSequencePhase = 'scale';
      break;
    case 'scale':
      sequenceState.currentSequencePhase = 'triads';
      break;
    default:
      console.warn('🎹 KEY SEQUENCE: Unknown phase', sequenceState.currentSequencePhase);
      return false;
  }
  
  console.log('🎹 KEY SEQUENCE: Advanced to phase', sequenceState.currentSequencePhase);
  return false; // Continue sequence
}

/**
 * Completes the current key sequence and prepares for the next one
 * @returns {boolean} - Always returns true to indicate completion
 */
function completeKeySequence() {
  const sequenceState = learningState.keySequenceState;
  
  console.log('🎹 KEY SEQUENCE: Completing sequence', {
    completedKey: sequenceState.currentSequenceKey,
    totalUsedInCycle: sequenceState.usedKeysInCurrentCycle.length
  });
  
  // Mark this key as the last completed key for anti-repetition
  sequenceState.lastCompletedKey = sequenceState.currentSequenceKey;
  
  // Reset sequence state
  sequenceState.inProgress = false;
  sequenceState.currentSequenceKey = null;
  sequenceState.currentSequencePhase = 'accCount';
  sequenceState.correctTriadsInCurrentKey = 0;
  
  return true; // Sequence is complete
}

/**
 * Gets the current chapter being practiced
 * @param {string} mode - The current practice mode
 * @param {Object} quizData - The quiz data object (passed from main.js)
 * @returns {Object} - The current chapter configuration
 */
function getCurrentChapter(mode, quizData = null) {
  const { currentChapterIndex, accidentalsPairState } = learningState;
  const group = getCurrentGroup();
   
  // Handle accidentals pairing logic
  if (accidentalsPairState.inProgress) {
    if (!accidentalsPairState.countAnswered) {
      // First part: accidentals count
      return group.chapters.find(c => c.id === 'accCount');
    } else {
      // Second part: accidentals naming (only if the key has accidentals)
      const key = accidentalsPairState.currentKey;
      if (quizData && quizData[key] && quizData[key].accidentals > 0) {
        return group.chapters.find(c => c.id === 'accNotes');
      } else {
        // Key has no accidentals, skip naming and end the pair
        accidentalsPairState.inProgress = false;
        accidentalsPairState.countAnswered = false;
        accidentalsPairState.currentKey = null;
        // Continue with normal chapter progression
        return group.chapters[currentChapterIndex];
      }
    }
  }
   
  // APPROACH 1: Chapter Index Detection for RANDOM_KEYS_LINEAR_CHAPTERS
  if (mode === window.MODES.RANDOM_KEYS_LINEAR_CHAPTERS) {
    const currentChapter = group.chapters[currentChapterIndex];
    
    // If we've reached accCount, start the pairing process
    if (currentChapter && currentChapter.id === 'accCount' && !accidentalsPairState.inProgress) {
      // Get a random key for this pair
      const randomKey = group.keys[Math.floor(Math.random() * group.keys.length)];
      
      // Activate pairing state
      accidentalsPairState.inProgress = true;
      accidentalsPairState.currentKey = randomKey;
      accidentalsPairState.countAnswered = false;
      
      return currentChapter; // Return accCount
    }
    
    // For all other chapters, return normally
    return currentChapter;
  }
   
  if (mode === window.MODES.NAMING_TRIADS) {
    const availableChapters = group.chapters.filter(c => c.id !== 'seventhSpelling' && c.id !== 'accNotes');
    return availableChapters[Math.floor(Math.random() * availableChapters.length)];
  }
  if (mode === window.MODES.ADVANCED_SEVENTHS) {
    return group.chapters.find(c => c.id === 'seventhSpelling');
  }
   
  // For linear mode, ensure accidentals naming is never selected standalone
  const currentChapter = group.chapters[currentChapterIndex];
  if (currentChapter && currentChapter.id === 'accNotes') {
    // Skip accidentals naming if we're not in a pair
    return group.chapters[currentChapterIndex + 1] || group.chapters[0];
  }
   
  return currentChapter;
}
window.getCurrentChapter = getCurrentChapter;

/**
 * Advances to the next question in the learning path
 * @param {Object} quizData - The quiz data object (passed from main.js)
 */
function advanceLearningPath(quizData = null) {
  const group = getCurrentGroup();
  const key = getCurrentKey(learningState.mode);
  // ✅ Use correct logic: only skip accNotes for C major (accidentals === 0)
  const currentChapterIndex = learningState.currentChapterIndex;
  const currentChapter = group.chapters[currentChapterIndex];
  let chapter = currentChapter;
  
  if (currentChapter && currentChapter.id === 'accNotes') {
    if (key && quizData && quizData[key] && quizData[key].accidentals === 0) {
      // Skip accNotes only for C major
      chapter = group.chapters[currentChapterIndex + 1] || group.chapters[0];
    }
  }
  
  learningState.correctAnswersInChapter = 0;
  learningState.usedDegrees = [];
  
  if (chapter && chapter.id === 'accCount' && key && quizData && quizData[key] && quizData[key].accidentals === 0) {
    learningState.currentChapterIndex += 2; // Skip accNotes
  } else {
    learningState.currentChapterIndex++;
  }
  
  // Have all chapters in the current key been completed?
  if (learningState.currentChapterIndex >= group.chapters.length) {
    learningState.currentChapterIndex = 0;
    learningState.currentKeyIndex++;
    
    // Have all keys in the current group been completed?
    if (learningState.currentKeyIndex >= group.keys.length) {
      learningState.currentKeyIndex = 0;
      
      // If this is a custom group (difficulty mode), loop back to the beginning
      if (learningState.customGroup) {
        // Continue looping within the same difficulty group
        return 'continue';
      } else {
        // Standard learning path - advance to next group
        learningState.currentGroup++;
        
        // Have all groups been completed?
        if (learningState.currentGroup >= window.learningPath.length) {
          // Path complete! Move to advanced practice.
          return 'advanced';
        } else {
          // Start the new group
          learningState.mode = getCurrentGroup().mode;
        }
      }
    }
  }

  return 'continue';
}
window.advanceLearningPath = advanceLearningPath;

/**
 * Starts advanced practice mode
 * @param {string} mode - The advanced mode type
 */
function startAdvancedPractice(mode) {
  learningState.mode = mode;
  
  // Advanced practice modes don't use the standard learning path groups
  // Set up custom group for advanced practice
  learningState.customGroup = {
    name: mode === 'naming_triads' ? 'Triad Practice' : 'Seventh Spelling Practice',
    mode: mode,
    keys: Object.keys(window.quizData), // All keys for both modes
    chapters: mode === 'spelling_sevenths' ? [window.CHAPTERS.SEVENTH_SPELLING] : Object.values(window.CHAPTERS),
    requiredStreak: Infinity
  };
  
  // Don't modify currentGroup for advanced practice - use customGroup instead
  learningState.currentChapterIndex = 0;
  learningState.correctAnswersInChapter = 0;
  learningState.usedDegrees = [];
  learningState.lastAnswerIncorrect = false;
  learningState.accidentalsPairState = {
    inProgress: false,
    currentKey: null,
    countAnswered: false
  };
  
  // Mark as advanced mode
  learningState.isAdvancedMode = true;
  learningState.advancedModeType = mode;
  
  // Generate and display the first question for this mode
  if (window.askQuestion) {
    window.askQuestion();
  }
}
window.startAdvancedPractice = startAdvancedPractice;

/**
 * Compatibility functions for tests
 * These provide the interface that the tests expect
 */

/**
 * Gets the current level (compatibility function for tests)
 * @returns {Object} - The current level object
 */
function getCurrentLevel() {
  return window.learningPath[learningState.currentGroup];
}

/**
 * Advances to the next level (compatibility function for tests)
 */
function advanceLevel() {
  learningState.currentGroup++;
  if (learningState.currentGroup >= window.learningPath.length) {
    learningState.currentGroup = 0; // Reset to beginning
  }
}

/**
 * Advances the question pointer (compatibility function for tests)
 */
function advanceQuestionPointer() {
  const group = getCurrentGroup();
  learningState.currentChapterIndex++;
  if (learningState.currentChapterIndex >= group.chapters.length) {
    learningState.currentChapterIndex = 0;
  }
}

// Expose functions globally for backward compatibility
window.getCurrentLevel = getCurrentLevel;
window.advanceLevel = advanceLevel;
window.advanceQuestionPointer = advanceQuestionPointer;

/**
 * Records a correct answer and advances the learning path
 */
function recordCorrectAnswer() {
  console.log('recordCorrectAnswer called');
  learningState.correctAnswersInChapter++;
  learningState.correctAnswerStreak++;
  learningState.lastAnswerIncorrect = false;
  
  console.log('Current state after increment:', {
    correctAnswersInChapter: learningState.correctAnswersInChapter,
    correctAnswerStreak: learningState.correctAnswerStreak,
    currentGroup: learningState.currentGroup,
    currentKeyIndex: learningState.currentKeyIndex,
    currentChapterIndex: learningState.currentChapterIndex
  });
  
  // Check if we've met the required streak for this chapter
  const group = getCurrentGroup();
  console.log('Current group:', group);
  console.log('Required streak:', group.requiredStreak);
  
  if (learningState.correctAnswersInChapter >= group.requiredStreak) {
    console.log('Streak requirement met, advancing learning path');
    // Advance to next question/chapter
    const result = window.advanceLearningPath(window.quizData);
    console.log('advanceLearningPath result:', result);
    if (result === 'advanced') {
      // All levels complete, move to advanced practice
      learningState.mode = window.MODES.NAMING_TRIADS;
    }
  } else {
    console.log('Streak requirement not met yet');
  }
  
  saveLearningState();
}
window.recordCorrectAnswer = recordCorrectAnswer;

/**
 * Records an incorrect answer
 */
function recordIncorrectAnswer() {
  learningState.correctAnswerStreak = 0;
  learningState.lastAnswerIncorrect = true;
  saveLearningState();
}
window.recordIncorrectAnswer = recordIncorrectAnswer;

/**
 * Records that the last incorrect answer was corrected
 */
function recordLastAnswerCorrected() {
  learningState.lastAnswerIncorrect = false;
  saveLearningState();
}
window.recordLastAnswerCorrected = recordLastAnswerCorrected;

/**
 * Checks if a degree+key combination has been used in the current b-level
 * @param {string} key - The key name
 * @param {number} degree - The degree number
 * @returns {boolean} - True if combination has been used
 */
function isCombinationUsed(key, degree) {
  const combination = `${key}-${degree}`;
  return learningState.usedCombinations.includes(combination);
}

/**
 * Records a degree+key combination as used in the current b-level
 * @param {string} key - The key name
 * @param {number} degree - The degree number
 */
function recordCombination(key, degree) {
  const combination = `${key}-${degree}`;
  if (!learningState.usedCombinations.includes(combination)) {
    learningState.usedCombinations.push(combination);
  }
}

/**
 * Clears used combinations when advancing to a new level
 */
function clearUsedCombinations() {
  learningState.usedCombinations = [];
}

// Expose combination functions globally
window.isCombinationUsed = isCombinationUsed;
window.recordCombination = recordCombination;
window.clearUsedCombinations = clearUsedCombinations;

// Expose key sequence functions globally
window.advanceKeySequence = advanceKeySequence;
window.completeKeySequence = completeKeySequence; 