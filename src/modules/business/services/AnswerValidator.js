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
    const correctScale = keyData.scale.map(n => n.toUpperCase()).join('');
    
    // Handle both spaced input ("c d e f g a b") and unspaced input ("cdefgab")
    let userNotes;
    if (userAnswer.trim().includes(' ')) {
      // Space-separated input
      userNotes = userAnswer.trim().split(/\s+/);
    } else {
      // Continuous input - split into individual characters for natural notes
      userNotes = userAnswer.trim().split('').filter(c => /[a-gA-G]/.test(c));
    }
    
    const userScale = userNotes
      .map(window.accidentalToUnicode)
      .join('')
      .toUpperCase();
    
    console.log('🎼 Scale Validation:', {
      correctScale,
      userScale,
      userAnswer,
      userNotes
    });
    
    return userScale === correctScale;
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