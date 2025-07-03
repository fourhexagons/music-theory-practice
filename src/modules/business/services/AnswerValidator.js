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
   * Pre-generate all valid inputs from quiz data
   * Supports both 7-note and 8-note (with repeated root) scale spellings
   * Seventh spellings remain 4 notes (no repetition)
   */
  preGenerateValidInputs() {
    console.log('🔄 Pre-generating valid inputs for finite set lookup...');
    
    Object.entries(this.quizData).forEach(([key, keyData]) => {
      // Generate scale input variations (8 per key: 7-note + 8-note × 4 case variations each)
      const scale7Note = keyData.scale;
      const scale8Note = [...keyData.scale, keyData.scale[0]]; // Add repeated root
      
      // 7-note scale variations
      const spaced7 = scale7Note.join(' ');
      const unspaced7 = scale7Note.join('');
      const spacedLower7 = spaced7.toLowerCase();
      const unspacedLower7 = unspaced7.toLowerCase();
      
      this.validScaleInputs.add(spaced7);
      this.validScaleInputs.add(unspaced7);
      this.validScaleInputs.add(spacedLower7);
      this.validScaleInputs.add(unspacedLower7);
      
      // 8-note scale variations (with repeated root)
      const spaced8 = scale8Note.join(' ');
      const unspaced8 = scale8Note.join('');
      const spacedLower8 = spaced8.toLowerCase();
      const unspacedLower8 = unspaced8.toLowerCase();
      
      this.validScaleInputs.add(spaced8);
      this.validScaleInputs.add(unspaced8);
      this.validScaleInputs.add(spacedLower8);
      this.validScaleInputs.add(unspacedLower8);
      
      // Generate chord input variations (28 per key: 7 degrees × 4 variations)
      // Seventh spellings remain 4 notes (no repetition of root)
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
    
    console.log(`✅ Generated ${this.validScaleInputs.size} valid scale inputs (7-note + 8-note variations)`);
    console.log(`✅ Generated ${this.validChordInputs.size} valid chord inputs (4-note only)`);
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