/**
 * Music Theory Practice - Helper Utilities
 * 
 * Contains general helper functions used throughout the application.
 */

// Create a namespace for our helper functions
window.MusicTheoryHelpers = {
  /**
   * Converts a number to its ordinal form (1st, 2nd, 3rd, etc.)
   * @param {number} n - The number to convert
   * @returns {string} - The ordinal form
   */
  ordinal(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  },

  /**
   * Converts a word representation of a number to its numeric value
   * @param {string} word - The word to convert (e.g., "one", "two")
   * @returns {number|null} - The numeric value or null if not found
   */
  wordToNumber(word) {
    const numberWords = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20
    };
    return numberWords[word.toLowerCase()] !== undefined ? numberWords[word.toLowerCase()] : null;
  },

  /**
   * Converts accidentals in a note string to Unicode symbols
   * @param {string} note - The note with accidentals (e.g., "C#", "Db", "F##")
   * @returns {string} - The note with Unicode accidentals
   */
  accidentalToUnicode(note) {
    if (!note) return '';
    // Use regex to capture the note and the accidentals separately
    const rootMatch = note.match(/^([a-g])(.*)/i);
    if (!rootMatch) return note; // Return original if it doesn't match expected pattern

    const [, root, accidentals] = rootMatch;

    // Process replacements on the accidentals part only. Order is critical.
    const normalizedAccidentals = accidentals
        .replace(/bbb/ig, '𝄫♭') // Handle triple flat explicitly first
        .replace(/bb/ig, '𝄫')
        .replace(/##|x/ig, '𝄪')
        .replace(/b/ig, '♭')
        .replace(/#/g, '♯');

    return root.toUpperCase() + normalizedAccidentals;
  },

  /**
   * Safely gets a DOM element by ID
   * @param {string} id - The element ID
   * @returns {HTMLElement|null} - The element or null if not found
   */
  getElement(id) {
    return document.getElementById(id);
  },

  /**
   * Safely sets text content of an element
   * @param {string} id - The element ID
   * @param {string} text - The text to set
   */
  setElementText(id, text) {
    const element = this.getElement(id);
    if (element) {
      element.textContent = text;
    }
  },

  /**
   * Safely sets the class name of an element
   * @param {string} id - The element ID
   * @param {string} className - The class name to set
   */
  setElementClass(id, className) {
    const element = this.getElement(id);
    if (element) {
      element.className = className;
    }
  },

  /**
   * Safely sets the value of an input element
   * @param {string} id - The element ID
   * @param {string} value - The value to set
   */
  setElementValue(id, value) {
    const element = this.getElement(id);
    if (element) {
      element.value = value;
    }
  },

  /**
   * Safely sets the display style of an element
   * @param {string} id - The element ID
   * @param {string} display - The display value to set
   */
  setElementDisplay(id, display) {
    const element = this.getElement(id);
    if (element) {
      element.style.display = display;
    }
  },

  /**
   * Debounces a function call
   * @param {Function} func - The function to debounce
   * @param {number} wait - The wait time in milliseconds
   * @returns {Function} - The debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttles a function call
   * @param {Function} func - The function to throttle
   * @param {number} limit - The throttle limit in milliseconds
   * @returns {Function} - The throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Also expose functions globally for backward compatibility
window.ordinal = window.MusicTheoryHelpers.ordinal;
window.wordToNumber = window.MusicTheoryHelpers.wordToNumber;
window.accidentalToUnicode = window.MusicTheoryHelpers.accidentalToUnicode;

function setQuestion(question) {
    learningState.currentQuestion = question;
}
window.setQuestion = setQuestion;

function generateQuestion() {
    const state = window.getLearningState();
    const currentGroup = window.getCurrentGroup();
    if (!currentGroup || !currentGroup.chapters || !currentGroup.keys || currentGroup.chapters.length === 0 || currentGroup.keys.length === 0) {
        handleError("No more groups or chapters. All levels complete.", { state, currentGroup });
        return null;
    }
    const currentChapter = window.getCurrentChapter(state.mode, window.quizData);
    if (!currentChapter) {
        handleError("Chapter not found!", { state });
        return null;
    }
    const currentKey = currentGroup.keys[state.currentKeyIndex];
    const keyData = window.quizData[currentKey];
    let question = {
        chapterId: currentChapter.id,
        key: currentKey,
        questionText: '',
        expectedAnswer: null
    };
    switch (currentChapter.id) {
        case 'accCount':
            question.questionText = `How many accidentals are in the key of ${currentKey}?`;
            question.expectedAnswer = keyData ? keyData.accidentals : null;
            break;
        case 'accNotes':
            question.questionText = `Name the accidentals in the key of ${currentKey}.`;
            question.expectedAnswer = keyData ? keyData.notes : null;
            break;
        case 'scale':
            question.questionText = `Spell the major scale for ${currentKey}.`;
            question.expectedAnswer = keyData ? keyData.scale : null;
            break;
        case 'triads':
        case 'sevenths':
            // Pick a random degree (1-7) not in usedDegrees
            const degrees = [1,2,3,4,5,6,7];
            let availableDegrees = degrees.filter(d => !state.usedDegrees.includes(d));
            if (availableDegrees.length === 0) {
                state.usedDegrees = [];
                availableDegrees = degrees;
            }
            const degree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];
            state.usedDegrees.push(degree);
            question.degree = degree;
            question.questionText = `What is the ${window.ordinal(degree)} degree ${currentChapter.id === 'triads' ? 'triad' : 'seventh chord'} in the key of ${currentKey}?`;
            question.expectedAnswer = keyData && keyData[currentChapter.id] ? keyData[currentChapter.id][degree.toString()] : null;
            break;
        default:
            handleError(`Unknown chapter id: ${currentChapter.id}`);
            return null;
    }
    setQuestion(question);
    return question;
}
window.generateQuestion = generateQuestion;

function getChordNotes(key, degree, quality, type) {
    // This is a simplified placeholder. A real implementation would
    // use music theory rules to construct the chord.
    const rootNote = key; // Placeholder
    const scale = getMajorScale(rootNote);
    const root = scale[degree-1];
    
    // In a real app, you'd build the chord from the root based on quality
    const notes = [`${root}`, `${root} a`, `${root} b`];
    if(type === 'SEVENTHS') notes.push(`${root} c`);

    return {
        notes: notes,
        spelling: `${root} ${quality}`
    };
}

function getRandomDegree(usedDegrees, maxDegrees) {
    if (usedDegrees.length >= maxDegrees) {
        usedDegrees.length = 0; // Reset if all degrees used
    }
    let degree;
    do {
        degree = Math.floor(Math.random() * maxDegrees) + 1;
    } while (usedDegrees.includes(degree));
    usedDegrees.push(degree);
    return degree;
}

function getMajorScale(root) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const intervals = [0, 2, 4, 5, 7, 9, 11];
    const rootIndex = notes.indexOf(root.charAt(0).toUpperCase() + (root.slice(1).toLowerCase() || ''));

    if (rootIndex === -1) return [];

    return intervals.map(interval => notes[(rootIndex + interval) % 12]);
}

/**
 * Updates the user's progress based on their answer.
 * @param {boolean} isCorrect - Whether the user's answer was correct.
 */
// ... existing code ... 