/**
 * Music Theory Practice - Validation Utilities
 * 
 * Contains validation functions for checking user answers.
 */

/**
 * Checks if a user answer is correct for a given question type
 * @param {string} userAnswer - The user's answer
 * @param {string} questionType - The type of question (e.g., 'SEVENTHS', 'TRIADS', 'SCALE_SPELLING', 'ACCIDENTALS_COUNT')
 * @param {string} key - The key being tested
 * @param {number} degree - The degree being tested (for chord questions)
 * @param {Object} quizData - The quiz data object
 * @returns {boolean} - Whether the answer is correct
 */
function checkAnswer(userAnswer, questionType, key, degree = null, quizData = null) {
  // Robust parameter and structure validation
  if (userAnswer === undefined || questionType === undefined || key === undefined || quizData === null || typeof quizData !== 'object') {
    return false;
  }
  // Normalize questionType to lowercase and map aliases
  const typeMap = {
    'sevenths': 'sevenths',
    'triads': 'triads',
    'scale': 'scale',
    'scalespelling': 'scale',
    'scale_spelling': 'scale',
    'accidentalscount': 'accCount',
    'accidentals_count': 'accCount',
    'acccount': 'accCount',
    'accnotes': 'accNotes',
    'accidentalsnames': 'accNotes',
    'accidentals_names': 'accNotes'
  };
  const normalizedType = typeof questionType === 'string' ? (typeMap[questionType.toLowerCase().replace(/[^a-z]/g, '')] || questionType.toLowerCase()) : '';
  // Only allow supported types
  const allowedTypes = ['sevenths', 'triads', 'scale', 'accCount'];
  if (!allowedTypes.includes(normalizedType)) {
    // Defensive: invalid type
    return false;
  }
  // Validate key exists and is a non-null object
  if (!quizData.hasOwnProperty(key) || typeof quizData[key] !== 'object' || quizData[key] === null) {
    // Defensive: invalid or missing key
    return false;
  }
  // For chord questions, validate type and degree structure
  if ((normalizedType === 'sevenths' || normalizedType === 'triads')) {
    const chordObj = quizData[key][normalizedType];
    if (!chordObj || typeof chordObj !== 'object' || chordObj === null) {
      // Defensive: invalid chord object
      return false;
    }
    if (degree === null || !Object.prototype.hasOwnProperty.call(chordObj, degree.toString())) {
      // Defensive: invalid or missing degree
      return false;
    }
  }
  try {
    let result = false;
    switch (normalizedType) {
      case 'sevenths':
      case 'triads':
        result = checkChordAnswer(userAnswer, normalizedType, key, degree, quizData);
        break;
      case 'scale':
        result = checkScaleSpelling(userAnswer, key, quizData);
        break;
      case 'acccount':
      case 'accCount':
        result = checkAccidentalsCount(userAnswer, key, quizData);
        break;
      default:
        return false;
    }
    return result === true;
  } catch (e) {
    return false;
  }
  return false;
}

/**
 * Checks if a chord answer is correct
 * @param {string} userAnswer - The user's chord answer
 * @param {string} questionType - The type of chord question
 * @param {string} key - The key being tested
 * @param {number} degree - The degree being tested
 * @param {Object} quizData - The quiz data object
 * @returns {boolean} - Whether the chord answer is correct
 */
function checkChordAnswer(userAnswer, questionType, key, degree, quizData) {
  // Defensive: validate all parameters and structure
  if (!quizData || typeof quizData !== 'object' || !quizData.hasOwnProperty(key) || typeof quizData[key] !== 'object' || quizData[key] === null) {
    return false;
  }
  const chordObj = quizData[key][questionType];
  if (!chordObj || typeof chordObj !== 'object' || chordObj === null) {
    return false;
  }
  if (degree === null || !Object.prototype.hasOwnProperty.call(chordObj, degree.toString())) {
    return false;
  }
  const correctAnswerRaw = chordObj[degree.toString()];
  if (typeof correctAnswerRaw !== 'string') return false;
  if (typeof userAnswer !== 'string') return false;
  const normalizedAnswer = window.normalizeChord ? window.normalizeChord(userAnswer) : userAnswer;
  const normalizedCorrect = window.normalizeChord ? window.normalizeChord(correctAnswerRaw) : correctAnswerRaw;
  if (typeof normalizedAnswer !== 'string' || typeof normalizedCorrect !== 'string') return false;
  return normalizedAnswer === normalizedCorrect;
}

/**
 * Checks if a scale spelling answer is correct
 * @param {string} userAnswer - The user's scale spelling
 * @param {string} key - The key being tested
 * @param {Object} quizData - The quiz data object
 * @returns {boolean} - Whether the scale spelling is correct
 */
function checkScaleSpelling(userAnswer, key, quizData) {
  // Defensive: validate all parameters and structure
  if (!quizData || typeof quizData !== 'object' || !quizData.hasOwnProperty(key) || typeof quizData[key] !== 'object' || quizData[key] === null) {
    return false;
  }
  if (!quizData[key].scale || !Array.isArray(quizData[key].scale)) {
    return false;
  }
  if (typeof userAnswer !== 'string') return false;
  // Normalize both user input and correct notes to Unicode accidentals
  const userNotes = userAnswer.split(' ').map(note => window.accidentalToUnicode(note.trim())).filter(note => note);
  const correctNotes = quizData[key].scale.map(note => window.accidentalToUnicode(note));
  if (!Array.isArray(userNotes) || !Array.isArray(correctNotes)) return false;
  if (userNotes.length !== correctNotes.length) {
    return false;
  }
  return userNotes.every((note, index) => note === correctNotes[index]);
}

/**
 * Checks if an accidentals count answer is correct
 * @param {string} userAnswer - The user's accidentals count
 * @param {string} key - The key being tested
 * @param {Object} quizData - The quiz data object
 * @returns {boolean} - Whether the accidentals count is correct
 */
function checkAccidentalsCount(userAnswer, key, quizData) {
  // Defensive: validate all parameters and structure
  if (!quizData || typeof quizData !== 'object' || !quizData.hasOwnProperty(key) || typeof quizData[key] !== 'object' || quizData[key] === null) {
    return false;
  }
  if (!quizData[key].hasOwnProperty('accidentals')) return false;
  if (typeof userAnswer !== 'string' && typeof userAnswer !== 'number') return false;
  const userCount = parseInt(String(userAnswer).trim(), 10);
  const correctCount = parseInt(quizData[key].accidentals, 10);
  if (isNaN(userCount) || isNaN(correctCount)) return false;
  return userCount === correctCount;
}

// Expose functions globally for backward compatibility
window.checkAnswer = checkAnswer; 