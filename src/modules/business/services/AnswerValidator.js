/**
 * Answer Validator Service
 * Handles validation of user answers against correct answers
 */
export class AnswerValidator {
  constructor(quizData) {
    this.quizData = quizData;
    
    // Pre-generate all valid inputs for finite set lookup
    this.validScaleInputs = new Set();
    this.validChordInputs = new Set();
    this.preGenerateValidInputs();
  }

  /**
   * Pre-generate all 480 valid inputs from quiz data
   * This creates a finite set of all possible correct answers
   */
  preGenerateValidInputs() {
    console.log('🔄 Pre-generating valid inputs for finite set lookup...');
    
    Object.entries(this.quizData).forEach(([key, keyData]) => {
      // Generate all scale input variations (4 per key)
      const scale = keyData.scale;
      const spaced = scale.join(' ');
      const unspaced = scale.join('');
      const spacedLower = spaced.toLowerCase();
      const unspacedLower = unspaced.toLowerCase();
      
      this.validScaleInputs.add(spaced);
      this.validScaleInputs.add(unspaced);
      this.validScaleInputs.add(spacedLower);
      this.validScaleInputs.add(unspacedLower);
      
      // Generate all chord input variations (28 per key: 7 degrees × 4 variations)
      for (let degree = 1; degree <= 7; degree++) {
        const chord = keyData.seventhSpelling[degree.toString()];
        const chordSpaced = chord.join(' ');
        const chordUnspaced = chord.join('');
        const chordSpacedLower = chordSpaced.toLowerCase();
        const chordUnspacedLower = chordUnspaced.toLowerCase();
        
        this.validChordInputs.add(chordSpaced);
        this.validChordInputs.add(chordUnspaced);
        this.validChordInputs.add(chordSpacedLower);
        this.validChordInputs.add(chordUnspacedLower);
      }
    });
    
    console.log(`✅ Generated ${this.validScaleInputs.size} valid scale inputs`);
    console.log(`✅ Generated ${this.validChordInputs.size} valid chord inputs`);
    console.log(`✅ Total valid inputs: ${this.validScaleInputs.size + this.validChordInputs.size}`);
  }

  validateAnswer(userAnswer, question) {
    if (!question || !this.quizData[question.key]) {
      return false;
    }

    const { key, chapterId, degree } = question;
    const keyData = this.quizData[key];

    // Log validation attempt for debugging
    console.log('🔍 Answer Validation:', {
      userAnswer,
      key,
      chapterId,
      degree
    });

    switch (chapterId) {
      case 'accCount':
        return this.validateAccidentalsCount(userAnswer, keyData);
        
      case 'accNotes':
        return this.validateAccidentalsNames(userAnswer, keyData);
        
      case 'scale':
        return this.validateScaleSpelling(userAnswer, keyData);
        
      case 'triads':
      case 'sevenths':
        return this.validateChordNaming(userAnswer, keyData, chapterId, degree);
        
      case 'seventhSpelling':
        return this.validateChordSpelling(userAnswer, keyData, degree);
        
      default:
        console.error(`Unknown chapter ID: ${chapterId}`);
        return false;
    }
  }

  validateAccidentalsCount(userAnswer, keyData) {
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    
    if (keyData.accidentals === 0) {
      return ['0', 'zero', 'none'].includes(normalizedAnswer);
    }
    
    const digitAnswer = parseInt(normalizedAnswer, 10);
    if (digitAnswer === keyData.accidentals) return true;
    
    const wordAnswer = window.wordToNumber(normalizedAnswer);
    return wordAnswer === keyData.accidentals;
  }

  validateAccidentalsNames(userAnswer, keyData) {
    if (keyData.accidentals === 0) {
      return userAnswer.trim() === '';
    }
    
    return window.normalizeAccList(userAnswer) === window.normalizeAccList(keyData.notes);
  }

  /**
   * Normalize input for consistent matching using existing chord normalization
   * This handles case, accidentals, and spacing consistently
   */
  normalizeInput(input) {
    const trimmed = input.trim();
    
    // Handle spaced input: normalize each note separately
    if (trimmed.includes(' ')) {
      return trimmed.split(/\s+/)
        .map(note => window.normalizeChord(note))
        .join(' ');
    }
    
    // Handle unspaced input: try to split and normalize each note
    // For simple cases, just normalize the whole string
    return window.normalizeChord(trimmed);
  }

  /**
   * Validate scale spelling using finite set lookup with case normalization
   * Simple lowercase conversion to match finite set entries
   */
  validateScaleSpelling(userAnswer, keyData) {
    const trimmedInput = userAnswer.trim();
    
    // Simple case normalization to match finite set (which contains simple lowercase)
    const normalizedInput = trimmedInput.toLowerCase();
    
    // Check if normalized input matches any valid scale input
    const isValid = this.validScaleInputs.has(normalizedInput);
    
    console.log('🎼 Scale Validation:', {
      userAnswer: trimmedInput,
      normalizedInput,
      isValid,
      matchedFromFiniteSet: isValid
    });
    
    return isValid;
  }

  /**
   * Validate chord spelling using finite set lookup with case normalization
   * Simple lowercase conversion to match finite set entries
   */
  validateChordSpelling(userAnswer, keyData, degree) {
    const trimmedInput = userAnswer.trim();
    
    // Simple case normalization to match finite set (which contains simple lowercase)
    const normalizedInput = trimmedInput.toLowerCase();
    
    // Check if normalized input matches any valid chord input
    const isValid = this.validChordInputs.has(normalizedInput);
    
    console.log('🎵 Chord Spelling Validation:', {
      userAnswer: trimmedInput,
      normalizedInput,
      degree,
      isValid,
      matchedFromFiniteSet: isValid
    });
    
    return isValid;
  }

  validateChordNaming(userAnswer, keyData, chordType, degree) {
    const expected = keyData[chordType][degree];
    
    console.log('🎵 Chord Validation:', {
      userAnswer,
      expected,
      normalized: {
        user: window.normalizeChord(userAnswer),
        expected: window.normalizeChord(expected)
      }
    });
    
    return window.normalizeChord(userAnswer).toUpperCase() === 
           window.normalizeChord(expected).toUpperCase();
  }
} 