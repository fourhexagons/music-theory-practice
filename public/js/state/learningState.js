/**
 * Music Theory Practice - Learning State Management
 * 
 * Manages the application's learning state including progress, current questions,
 * and user session data.
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
  // Reset advanced mode flags
  isAdvancedMode: false,
  advancedModeType: null,
  customGroup: null
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
    'usedDegrees', 'lastAnswerIncorrect', 'accidentalsPairState'
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
    typeof learningState.accidentalsPairState !== 'object'
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
  // Development mode - set to true to always start fresh for testing
  if (false) {
    console.log("DEV MODE: Resetting learning state.");
    resetLearningState();
  }
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
    customGroup: null
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
  if (learningState.accidentalsPairState && learningState.accidentalsPairState.inProgress) {
    return learningState.accidentalsPairState.currentKey;
  }
  if (mode === window.MODES.RANDOM_ALL || mode.startsWith('advanced')) {
    return group.keys[Math.floor(Math.random() * group.keys.length)];
  }
  return group.keys[learningState.currentKeyIndex];
}
window.getCurrentKey = getCurrentKey;

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
      }
    }
  }
   
  if (mode === window.MODES.RANDOM_ALL) {
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
  const chapter = getCurrentChapter(learningState.mode, quizData);
  
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
  const groupName = mode === window.MODES.RANDOM_ALL ? 'Randomize' : 'Seventh Spelling';
  learningState.currentGroup = window.learningPath.findIndex(g => g.name === groupName);
  learningState.currentChapterIndex = 0;
  learningState.correctAnswersInChapter = 0;
  learningState.usedDegrees = [];
  learningState.lastAnswerIncorrect = false;
  learningState.accidentalsPairState = {
    inProgress: false,
    currentKey: null,
    countAnswered: false
  };
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
      learningState.mode = window.MODES.RANDOM_ALL;
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