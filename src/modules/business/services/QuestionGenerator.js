/**
 * Question Generator Service
 * Handles generating questions based on learning state and mode
 */
export class QuestionGenerator {
  constructor(quizData, learningState) {
    this.quizData = quizData;
    this.learningState = learningState;
  }

  generateQuestion() {
    const group = window.getCurrentGroup();
    if (!group || group.mode === 'complete') {
      return null;
    }

    const key = this.determineKey(group);
    const chapter = this.determineChapter(group);
    
    if (!key || !chapter) {
      return null;
    }

    return this.buildQuestion(key, chapter);
  }

  determineKey(group) {
    if (group.mode === 'linear') {
      return group.keys[this.learningState.currentKeyIndex];
    } else {
      // Random key selection for other modes
      return group.keys[Math.floor(Math.random() * group.keys.length)];
    }
  }

  determineChapter(group) {
    if (group.mode === 'random_all') {
      const availableChapters = Object.values(window.CHAPTERS).filter(chapter => 
        chapter.id !== 'accNotes' && chapter.id !== 'seventhSpelling'
      );
      return availableChapters[Math.floor(Math.random() * availableChapters.length)];
    } else {
      return group.chapters[this.learningState.currentChapterIndex];
    }
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
    const allDegrees = [2, 3, 4, 5, 6, 7];
    let availableDegrees = allDegrees.filter(d => !this.learningState.usedDegrees.includes(d));
    
    if (availableDegrees.length === 0) {
      this.learningState.usedDegrees = [];
      availableDegrees = allDegrees;
    }
    
    const degree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];
    question.degree = degree;
    
    const chordType = chapter.id === 'triads' ? 'triad' : 'seventh chord';
    const action = chapter.id === 'seventhSpelling' ? 'Spell' : 'Name';
    question.text = `${action} the ${window.ordinal(degree)} ${chordType} in ${question.key} major.`;
    
    return question;
  }
} 