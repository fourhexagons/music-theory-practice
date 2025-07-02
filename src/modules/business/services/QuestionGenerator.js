/**
 * Question Generator Service
 * Handles generating questions based on learning state and mode
 */
export class QuestionGenerator {
  constructor(quizData, learningState, stateManager) {
    this.quizData = quizData;
    this.learningState = learningState;
    this.stateManager = stateManager;
  }

  generateQuestion() {
    const group = this.stateManager.getCurrentGroup();
    if (!group || group.mode === 'complete') {
      return null;
    }

    // Use StateManager methods with correct C-major-only accNotes skipping logic
    const key = this.stateManager.getCurrentKey(group.mode);
    const chapter = this.stateManager.getCurrentChapter();
    
    if (!key || !chapter) {
      return null;
    }

    return this.buildQuestion(key, chapter);
  }



  buildQuestion(key, chapter) {
    const question = {
      key,
      chapterId: chapter.id,
      text: '',
      degree: null
    };

    switch (chapter.id) {
      case 'accCount':
        question.text = `How many accidentals are in ${key} major?`;
        break;
        
      case 'accNotes':
        question.text = `Name the accidentals in ${key} major.`;
        this.learningState.lastAccidentalsKey = key;
        break;
        
      case 'scale':
        question.text = `Spell the ${key} major scale.`;
        break;
        
      case 'triads':
      case 'sevenths':
      case 'seventhSpelling':
        return this.buildChordQuestion(question, chapter);
        
      default:
        console.error(`Unknown chapter ID: ${chapter.id}`);
        return null;
    }

    return question;
  }

  buildChordQuestion(question, chapter) {
    const group = this.stateManager.getCurrentGroup();
    const allDegrees = [2, 3, 4, 5, 6, 7];
    
    // For b-levels (RANDOM_KEYS_LINEAR_CHAPTERS), use combination prevention
    if (group.mode === window.MODES.RANDOM_KEYS_LINEAR_CHAPTERS) {
      // Try to find an unused degree+key combination
      let availableDegrees = allDegrees.filter(degree => !window.isCombinationUsed(question.key, degree));
      
      // If no unused combinations for this key, allow any degree (might repeat, but user said it's ok if different key)
      if (availableDegrees.length === 0) {
        availableDegrees = allDegrees;
      }
      
      const degree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];
      question.degree = degree;
      
      // Record this combination as used
      window.recordCombination(question.key, degree);
    } else {
      // For other modes, use the original logic
      let availableDegrees = allDegrees.filter(d => !this.learningState.usedDegrees.includes(d));
      
      if (availableDegrees.length === 0) {
        this.learningState.usedDegrees = [];
        availableDegrees = allDegrees;
      }
      
      const degree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];
      question.degree = degree;
    }
    
    const chordType = chapter.id === 'triads' ? 'triad' : 'seventh chord';
    const action = chapter.id === 'seventhSpelling' ? 'Spell' : 'Name';
    question.text = `${action} the ${window.ordinal(question.degree)} ${chordType} in ${question.key} major.`;
    
    return question;
  }
} 