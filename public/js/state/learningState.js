/**
 * Music Theory Practice - Learning State Management
 * 
 * Manages the application's learning state including progress, current questions,
 * and user session data.
 */

import { learningPath, MODES } from '../data/quizData.js';

/**
 * Learning state object containing all application state
 */
export const learningState = {
  currentGroup: 0,
  currentKeyIndex: 0,
  currentChapterIndex: 0,
  mode: MODES.LINEAR,
  currentQuestion: null,
  correctAnswersInChapter: 0,
  requiredAnswersPerChapter: 3,
  usedDegrees: [],
  lastAnswerIncorrect: false,
  // State for accidentals pairing
  accidentalsPairState: {
    inProgress: false,
    currentKey: null,
    countAnswered: false
  }
};

/**
 * Initializes the learning state from localStorage or defaults
 */
export function initLearningState() {
  const saved = localStorage.getItem('learningState');
  if (saved) {
    try {
      Object.assign(learningState, JSON.parse(saved));
    } catch (error) {
      console.error('Error parsing saved state:', error);
      resetLearningState();
    }
  }

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

/**
 * Resets the learning state to initial values
 */
export function resetLearningState() {
  Object.assign(learningState, {
    currentGroup: 0,
    currentKeyIndex: 0,
    currentChapterIndex: 0,
    correctAnswersInChapter: 0,
    usedDegrees: [],
    mode: MODES.LINEAR,
    lastAnswerIncorrect: false,
    accidentalsPairState: {
      inProgress: false,
      currentKey: null,
      countAnswered: false
    }
  });
}

/**
 * Saves the current learning state to localStorage
 */
export function saveLearningState() {
  try {
    localStorage.setItem('learningState', JSON.stringify(learningState));
  } catch (error) {
    console.error('Error saving state:', error);
  }
}

/**
 * Gets the current learning group
 * @returns {Object} - The current group configuration
 */
export function getCurrentGroup() {
  return learningPath.groups[learningState.currentGroup];
}

/**
 * Gets the current key being practiced
 * @param {string} mode - The current practice mode
 * @returns {string} - The current key
 */
export function getCurrentKey(mode) {
  const group = getCurrentGroup();
  if (learningState.accidentalsPairState && learningState.accidentalsPairState.inProgress) {
    return learningState.accidentalsPairState.currentKey;
  }
  if (mode === MODES.RANDOM || mode.startsWith('advanced')) {
    return group.keys[Math.floor(Math.random() * group.keys.length)];
  }
  return group.keys[learningState.currentKeyIndex];
}

/**
 * Gets the current chapter being practiced
 * @param {string} mode - The current practice mode
 * @param {Object} quizData - The quiz data object (passed from main.js)
 * @returns {Object} - The current chapter configuration
 */
export function getCurrentChapter(mode, quizData = null) {
  const { currentChapterIndex, accidentalsPairState } = learningState;
   
  // Handle accidentals pairing logic
  if (accidentalsPairState.inProgress) {
    if (!accidentalsPairState.countAnswered) {
      // First part: accidentals count
      return learningPath.chapters.find(c => c.id === 'accCount');
    } else {
      // Second part: accidentals naming (only if the key has accidentals)
      const key = accidentalsPairState.currentKey;
      if (quizData && quizData[key] && quizData[key].accidentals > 0) {
        return learningPath.chapters.find(c => c.id === 'accNotes');
      } else {
        // Key has no accidentals, skip naming and end the pair
        accidentalsPairState.inProgress = false;
        accidentalsPairState.countAnswered = false;
        accidentalsPairState.currentKey = null;
      }
    }
  }
   
  if (mode === MODES.ADVANCED_ALL) {
    const availableChapters = learningPath.chapters.filter(c => c.id !== 'seventhSpelling' && c.id !== 'accNotes');
    return availableChapters[Math.floor(Math.random() * availableChapters.length)];
  }
  if (mode === MODES.ADVANCED_SEVENTHS) {
    return learningPath.chapters.find(c => c.id === 'seventhSpelling');
  }
   
  // For linear mode, ensure accidentals naming is never selected standalone
  const currentChapter = learningPath.chapters[currentChapterIndex];
  if (currentChapter.id === 'accNotes') {
    // Skip accidentals naming if we're not in a pair
    return learningPath.chapters[currentChapterIndex + 1] || learningPath.chapters[0];
  }
   
  return currentChapter;
}

/**
 * Advances to the next question in the learning path
 * @param {Object} quizData - The quiz data object (passed from main.js)
 */
export function advanceLearningPath(quizData = null) {
  const group = getCurrentGroup();
  const key = getCurrentKey(learningState.mode);
  const chapter = getCurrentChapter(learningState.mode, quizData);
  
  learningState.correctAnswersInChapter = 0;
  learningState.usedDegrees = [];
  
  if (chapter.id === 'accCount' && key && quizData && quizData[key] && quizData[key].accidentals === 0) {
    learningState.currentChapterIndex += 2; // Skip accNotes
  } else {
    learningState.currentChapterIndex++;
  }
  
  // Have all chapters in the current key been completed?
  if (learningState.currentChapterIndex >= learningPath.chapters.length) {
    learningState.currentChapterIndex = 0;
    learningState.currentKeyIndex++;
    
    // Have all keys in the current group been completed?
    if (learningState.currentKeyIndex >= group.keys.length) {
      learningState.currentKeyIndex = 0;
      learningState.currentGroup++;
      
      // Have all groups been completed?
      if (learningState.currentGroup >= learningPath.groups.length) {
        // Path complete! Move to advanced practice.
        return 'advanced';
      } else {
        // Start the new group
        learningState.mode = getCurrentGroup().mode;
      }
    }
  }

  return 'continue';
}

/**
 * Starts advanced practice mode
 * @param {string} mode - The advanced practice mode
 */
export function startAdvancedPractice(mode) {
  learningState.mode = mode;
  const groupName = mode === MODES.ADVANCED_ALL ? 'Randomize' : 'Seventh Spelling';
  learningState.currentGroup = learningPath.groups.findIndex(g => g.name === groupName);
  learningState.currentChapterIndex = 0;
  learningState.correctAnswersInChapter = 0;
} 