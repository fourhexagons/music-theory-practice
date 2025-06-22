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