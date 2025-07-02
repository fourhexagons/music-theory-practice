/**
 * Music Theory Practice - Validation Utilities
 * 
 * Contains validation functions for checking user answers.
 */

console.log('Loaded validation.js - DEBUG PATCH');

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
    'accidentals_names': 'accNotes',
    'seventhspelling': 'seventhSpelling',
    'triadspelling': 'triadSpelling'
  };
  const normalizedType = typeof questionType === 'string' ? (typeMap[questionType.toLowerCase().replace(/[^a-z]/g, '')] || questionType.toLowerCase()) : '';
  // Only allow supported types
  const allowedTypes = ['sevenths', 'triads', 'scale', 'accCount', 'accNotes', 'seventhSpelling', 'triadSpelling'];
  if (!allowedTypes.includes(normalizedType)) {
    console.log('checkAnswer: invalid type', {questionType, normalizedType});
    return false;
  }
  // Validate key exists and is a non-null object
  if (!quizData.hasOwnProperty(key) || typeof quizData[key] !== 'object' || quizData[key] === null) {
    console.log('checkAnswer: invalid or missing key', {key, quizDataKey: quizData[key]});
    return false;
  }
  // For chord questions, validate type and degree structure
  if ((normalizedType === 'sevenths' || normalizedType === 'triads')) {
    const chordObj = quizData[key][normalizedType];
    if (!chordObj || typeof chordObj !== 'object' || chordObj === null) {
      console.log('checkAnswer: invalid chord object', {key, normalizedType, chordObj});
      return false;
    }
    if (degree === null || !Object.prototype.hasOwnProperty.call(chordObj, degree.toString())) {
      console.log('checkAnswer: invalid or missing degree', {degree, chordObj});
      return false;
    }
  }
  try {
    let result = false;
    console.log('checkAnswer: normalizedType', normalizedType);
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
      case 'accNotes':
        result = checkAccidentalsNames(userAnswer, key, quizData);
        break;
      case 'seventhSpelling':
        console.log('checkAnswer: entering checkChordSpelling for seventhSpelling');
        result = checkChordSpelling(userAnswer, key, degree, quizData, 'seventhSpelling');
        break;
      case 'triadSpelling':
        result = checkChordSpelling(userAnswer, key, degree, quizData, 'triadSpelling');
        break;
      default:
        console.log('checkAnswer: default case hit', {normalizedType});
        return false;
    }
    return result === true;
  } catch (e) {
    console.log('checkAnswer: caught error', e);
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
  // Normalize both user input and correct notes to Unicode accidentals and uppercase root
  const normalizeAndUpper = note => {
    const n = window.accidentalToUnicode(note.trim());
    return n ? n[0].toUpperCase() + n.slice(1) : '';
  };
  const userNotes = userAnswer.split(' ').map(normalizeAndUpper).filter(note => note);
  const correctNotes = quizData[key].scale.map(normalizeAndUpper);
  console.log('[checkScaleSpelling] userNotes:', userNotes, 'correctNotes:', correctNotes);
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

/**
 * Checks if a chord spelling answer is correct (for seventh/triad spellings)
 * @param {string} userAnswer - The user's answer (space-separated notes)
 * @param {string} key - The key being tested
 * @param {number} degree - The degree being tested
 * @param {Object} quizData - The quiz data object
 * @param {string} spellingType - 'seventhSpelling' or 'triadSpelling'
 * @returns {boolean} - Whether the spelling is correct
 */
function checkChordSpelling(userAnswer, key, degree, quizData, spellingType) {
  console.log('checkChordSpelling ENTRY', { userAnswer, key, degree, spellingType });
  if (!quizData || typeof quizData !== 'object' || !quizData.hasOwnProperty(key) || typeof quizData[key] !== 'object' || quizData[key] === null) {
    console.log('checkChordSpelling: quizData/key invalid', {quizData, key});
    return false;
  }
  if (!quizData[key][spellingType] || typeof quizData[key][spellingType] !== 'object') {
    console.log('checkChordSpelling: spellingType invalid', {spellingType, data: quizData[key][spellingType]});
    return false;
  }
  if (degree === null || !Object.prototype.hasOwnProperty.call(quizData[key][spellingType], degree.toString())) {
    console.log('checkChordSpelling: degree invalid', {degree, spellingData: quizData[key][spellingType]});
    return false;
  }
  if (typeof userAnswer !== 'string') {
    console.log('checkChordSpelling: userAnswer not string', {userAnswer});
    return false;
  }
  // Normalize and split user input
  const userNotes = userAnswer.trim().split(/\s+/).map(note => window.normalizeRootNote(note)).filter(note => note);
  const correctNotes = quizData[key][spellingType][degree.toString()].map(note => window.normalizeRootNote(note));
  console.log('checkChordSpelling: Normalized notes', { userNotes, correctNotes });
  if (userNotes.length !== correctNotes.length) {
    console.log('checkChordSpelling: length mismatch', { userNotes, correctNotes });
    return false;
  }
  for (let i = 0; i < correctNotes.length; i++) {
    if (userNotes[i] !== correctNotes[i]) {
      console.log('checkChordSpelling: note mismatch', { i, userNote: userNotes[i], correctNote: correctNotes[i] });
      return false;
    }
  }
  return true;
}

/**
 * Checks if an accidentals names answer is correct
 * @param {string|array} userAnswer - The user's accidentals names (e.g., 'F# C#' or ['F#','C#'])
 * @param {string} key - The key being tested
 * @param {Object} quizData - The quiz data object
 * @returns {boolean} - Whether the accidentals names are correct (order-insensitive)
 */
function checkAccidentalsNames(userAnswer, key, quizData) {
  if (!quizData || typeof quizData !== 'object' || !quizData.hasOwnProperty(key) || typeof quizData[key] !== 'object' || quizData[key] === null) {
    return false;
  }
  if (!quizData[key].hasOwnProperty('notes') || !Array.isArray(quizData[key].notes)) return false;
  // Accept string or array
  let userNotes;
  if (typeof userAnswer === 'string') {
    const trimmed = userAnswer.trim();
    // Handle "none" as a special case for keys with no accidentals
    if (trimmed === '' || trimmed.toLowerCase() === 'none') {
      userNotes = [];
    } else {
      userNotes = trimmed.split(/\s+/);
    }
  } else if (Array.isArray(userAnswer)) {
    userNotes = userAnswer;
  } else {
    return false;
  }
  // Normalize to Unicode and uppercase root
  const normalizeAndUpper = note => {
    const n = window.accidentalToUnicode(note.trim());
    return n ? n[0].toUpperCase() + n.slice(1) : '';
  };
  const userNorm = userNotes.map(normalizeAndUpper).filter(Boolean).sort();
  const correctNorm = quizData[key].notes.map(normalizeAndUpper).filter(Boolean).sort();
  console.log('[checkAccidentalsNames] userNorm:', userNorm, 'correctNorm:', correctNorm);
  // Accept empty string/array for keys with no accidentals
  if (correctNorm.length === 0 && userNorm.length === 0) return true;
  if (userNorm.length !== correctNorm.length) return false;
  // Order-insensitive comparison
  for (let i = 0; i < correctNorm.length; i++) {
    if (userNorm[i] !== correctNorm[i]) return false;
  }
  return true;
}

// Expose functions globally for backward compatibility
window.checkAnswer = checkAnswer; 