/**
 * Answer Validator Service
 * Handles validation of user answers against correct answers
 */
export class AnswerValidator {
  constructor(quizData) {
    this.quizData = quizData;
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

  validateScaleSpelling(userAnswer, keyData) {
    // Apply accidentalToUnicode to BOTH correct scale and user input for consistent comparison
    const correctScale = keyData.scale
      .map(window.accidentalToUnicode)
      .join('')
      .toUpperCase();
    
    // Handle both spaced input ("c d e f g a b") and unspaced input ("cdefgab")
    let userNotes;
    if (userAnswer.trim().includes(' ')) {
      // Space-separated input
      userNotes = userAnswer.trim().split(/\s+/);
    } else {
      // Continuous input - parse notes with accidentals properly
      userNotes = this.parseUnspacedInput(userAnswer.trim());
    }
    
    const userScale = userNotes
      .map(window.accidentalToUnicode)
      .join('')
      .toUpperCase();
    
    return userScale === correctScale;
  }

  /**
   * Parse unspaced musical input into individual notes with accidentals
   * Conservative approach: only handles double letters and explicit symbols
   */
  parseUnspacedInput(input) {
    const notes = [];
    let i = 0;
    
    while (i < input.length) {
      const char = input[i];
      
      if (/[a-gA-G]/.test(char)) {
        let note = char;
        let j = i + 1;
        
        // Look ahead to collect accidentals
        while (j < input.length) {
          const nextChar = input[j];
          
          // Only handle double letters (bb, BB, Bb, bB) and explicit symbols
          if ((nextChar === 'b' || nextChar === 'B') && char.toLowerCase() === nextChar.toLowerCase()) {
            // Same letter doubled = flat
            note += nextChar;
            j++;
          }
          // Special case: E-flat (Eb, eb, EB, eB) - very common and unambiguous
          else if ((nextChar === 'b' || nextChar === 'B') && char.toLowerCase() === 'e') {
            note += nextChar;
            j++;
          }
          // Handle explicit sharp/flat symbols  
          else if (/[#♯♭𝄪𝄫x]/u.test(nextChar)) {
            note += nextChar;
            j++;
          }
          // Stop at next note letter
          else if (/[a-gA-G]/.test(nextChar)) {
            break;
          }
          // Skip unknown characters
          else {
            j++;
          }
        }
        
        notes.push(note);
        i = j;
      } else {
        // Skip unknown characters
        i++;
      }
    }
    
    return notes;
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

  validateChordSpelling(userAnswer, keyData, degree) {
    const correctSpelling = keyData.seventhSpelling[degree]
      .map(window.accidentalToUnicode)
      .map(n => n.toUpperCase())
      .join('');
    
    const userSpelling = userAnswer.trim()
      .split(/\s+/)
      .map(window.accidentalToUnicode)
      .join('')
      .toUpperCase();
    
    return userSpelling === correctSpelling;
  }
} 