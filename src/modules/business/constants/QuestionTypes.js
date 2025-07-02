/**
 * Question Type Constants
 * Centralized constants for question types and modes
 */
export const QUESTION_TYPES = {
  ACCIDENTALS_COUNT: 'accCount',
  ACCIDENTALS_NAMES: 'accNotes',
  SCALE_SPELLING: 'scale',
  TRIADS: 'triads',
  SEVENTHS: 'sevenths',
  SEVENTH_SPELLING: 'seventhSpelling'
};

export const MODES = {
  LINEAR: 'linear',
  RANDOM_KEYS_LINEAR_CHAPTERS: 'random_keys_linear_chapters',
      NAMING_TRIADS: 'naming_triads',
  COMPLETE: 'complete'
};

// Export for backward compatibility
window.QUESTION_TYPES = QUESTION_TYPES;
window.MODES = MODES; 