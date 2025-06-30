import { MusicUtils } from '../../business/utils/MusicUtils.js';

export class QuizService {
  constructor(appController) {
    this.appController = appController;
  }

  askQuestion() {
    const group = window.getCurrentGroup();
    if (!group || group.mode === window.MODES.COMPLETE) {
      this.appController.updateQuestionUI('');
      return;
    }
    let key, chapter;
    if (group.mode === window.MODES.LINEAR) {
      key = group.keys[window.learningState.currentKeyIndex];
    } else {
      key = group.keys[Math.floor(Math.random() * group.keys.length)];
    }
    if (group.mode === window.MODES.RANDOM_ALL) {
      const availableChapters = Object.values(window.CHAPTERS).filter(chapter =>
        chapter.id !== window.QUESTION_TYPES.ACCIDENTALS_NAMES &&
        chapter.id !== window.QUESTION_TYPES.SEVENTH_SPELLING
      );
      chapter = availableChapters[Math.floor(Math.random() * availableChapters.length)];
    } else {
      chapter = group.chapters[window.learningState.currentChapterIndex];
    }
    window.learningState.currentQuestion = { key, chapterId: chapter.id };
    let text = '';
    let degree;
    switch (chapter.id) {
      case window.QUESTION_TYPES.ACCIDENTALS_COUNT:
        text = `How many accidentals are in ${key} major?`;
        break;
      case window.QUESTION_TYPES.ACCIDENTALS_NAMES:
        text = `Name the accidentals in ${key} major.`;
        window.learningState.lastAccidentalsKey = key;
        break;
      case window.QUESTION_TYPES.SCALE_SPELLING:
        text = `Spell the ${key} major scale.`;
        break;
      case window.QUESTION_TYPES.TRIADS:
      case window.QUESTION_TYPES.SEVENTHS:
      case window.QUESTION_TYPES.SEVENTH_SPELLING: {
        const allDegrees = [2, 3, 4, 5, 6, 7];
        let availableDegrees = allDegrees.filter(d => !window.learningState.usedDegrees.includes(d));
        if (availableDegrees.length === 0) {
          if (group.mode !== window.MODES.LINEAR) {
            window.learningState.usedDegrees = [];
            availableDegrees = allDegrees;
          }
        }
        degree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];
        window.learningState.currentQuestion.degree = degree;
        const chordType = chapter.id === window.QUESTION_TYPES.TRIADS ? 'triad' : 'seventh chord';
        const action = chapter.id === window.QUESTION_TYPES.SEVENTH_SPELLING ? 'Spell' : 'Name';
        text = `${action} the ${MusicUtils.ordinal(degree)} ${chordType} in ${key} major.`;
        break;
      }
    }
    this.appController.updateQuestionUI(text);
  }

  handleAnswerSubmit(e) {
    e.preventDefault();
    const answer = document.getElementById('answer-input').value;
    const feedback = document.getElementById('feedback');
    const isCorrect = this.checkAnswer(answer);
    if (isCorrect) {
      if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
      }
      const answerInput = document.getElementById('answer-input');
      if (answerInput) {
        answerInput.value = '';
      }
      if (window.learningState.isAdvancedMode) {
        if (window.learningState.currentQuestion &&
            window.learningState.currentQuestion.chapterId === window.QUESTION_TYPES.ACCIDENTALS_COUNT &&
            window.quizData[window.learningState.currentQuestion.key].accidentals > 0) {
          const key = window.learningState.currentQuestion.key;
          window.learningState.currentQuestion = { key: key, chapterId: window.QUESTION_TYPES.ACCIDENTALS_NAMES };
          const text = `Name the accidentals in ${key} major.`;
          this.appController.updateQuestionUI(text, false);
        } else {
          this.startAdvancedPractice(window.learningState.advancedModeType);
        }
        return;
      }
      const group = window.getCurrentGroup();
      if (window.learningState.customGroup && group.keys.length === 1) {
        const currentChapter = group.chapters[window.learningState.currentChapterIndex];
        if (currentChapter.id === window.QUESTION_TYPES.TRIADS) {
          window.learningState.correctChordAnswersForCurrentKey++;
          if (window.learningState.currentQuestion && window.learningState.currentQuestion.degree) {
            window.learningState.usedDegrees.push(window.learningState.currentQuestion.degree);
          }
          if (window.learningState.correctChordAnswersForCurrentKey >= 3) {
            window.learningState.correctChordAnswersForCurrentKey = 0;
            window.learningState.usedDegrees = [];
          }
          window.learningState.currentChapterIndex = group.chapters.findIndex(ch => ch.id === window.QUESTION_TYPES.TRIADS);
          this.askQuestion();
          return;
        } else {
          window.advanceQuestionPointer();
          const triadsIdx = group.chapters.findIndex(ch => ch.id === window.QUESTION_TYPES.TRIADS);
          if (window.learningState.currentChapterIndex >= triadsIdx) {
            window.learningState.currentChapterIndex = triadsIdx;
            window.learningState.usedDegrees = [];
          }
          this.askQuestion();
          return;
        }
      }
      if (group.mode === window.MODES.LINEAR) {
        const currentChapter = group.chapters[window.learningState.currentChapterIndex];
        if (currentChapter.id === window.QUESTION_TYPES.TRIADS) {
          window.learningState.correctChordAnswersForCurrentKey++;
          if (window.learningState.currentQuestion && window.learningState.currentQuestion.degree) {
            window.learningState.usedDegrees.push(window.learningState.currentQuestion.degree);
          }
          if (window.learningState.correctChordAnswersForCurrentKey >= 3) {
            window.learningState.correctChordAnswersForCurrentKey = 0;
            window.learningState.usedDegrees = [];
            window.learningState.currentKeyIndex++;
            if (window.learningState.currentKeyIndex >= group.keys.length) {
              if (window.learningState.customGroup) {
                window.learningState.currentKeyIndex = 0;
                window.learningState.currentChapterIndex = 0;
              } else {
                window.advanceLevel();
              }
            } else {
              window.learningState.currentChapterIndex = 0;
            }
          }
        } else {
          window.advanceQuestionPointer();
        }
      } else {
        window.learningState.correctAnswerStreak++;
        if (window.learningState.correctAnswerStreak >= group.requiredStreak) {
          if (window.learningState.customGroup) {
            window.learningState.correctAnswerStreak = 0;
            window.learningState.currentKeyIndex = 0;
            window.learningState.currentChapterIndex = 0;
          } else {
            window.advanceLevel();
          }
        } else {
          window.advanceQuestionPointer();
        }
      }
      this.askQuestion();
    } else {
      if (feedback) {
        feedback.textContent = 'Incorrect. Try again.';
        feedback.className = 'feedback incorrect';
      }
      window.learningState.correctAnswerStreak = 0;
    }
  }

  checkAnswer(answer) {
    const q = window.learningState.currentQuestion;
    if (!q) return false;
    const { key, chapterId, degree } = q;
    const data = window.quizData[key];
    switch(chapterId) {
      case window.QUESTION_TYPES.ACCIDENTALS_COUNT: {
        const normalizedAnswer = answer.trim().toLowerCase();
        if (data.accidentals === 0) {
          return ['0', 'zero', 'none'].includes(normalizedAnswer);
        }
        const digitAnswer = parseInt(normalizedAnswer, 10);
        if (digitAnswer === data.accidentals) return true;
        const wordAnswer = window.wordToNumber(normalizedAnswer);
        return wordAnswer === data.accidentals;
      }
      case window.QUESTION_TYPES.ACCIDENTALS_NAMES: {
        if (data.accidentals === 0) return answer.trim() === '';
        return window.normalizeAccList(answer) === window.normalizeAccList(data.notes);
      }
      case window.QUESTION_TYPES.SCALE_SPELLING: {
        const correctScale = data.scale.map(n => n.toUpperCase()).join('');
        const userScale = answer.trim().split(/\s+/).map(window.accidentalToUnicode).join('').toUpperCase();
        return userScale === correctScale;
      }
      case window.QUESTION_TYPES.TRIADS: {
        return window.normalizeChord(answer).toUpperCase() === window.normalizeChord(data.triads[degree]).toUpperCase();
      }
      case window.QUESTION_TYPES.SEVENTHS: {
        return window.normalizeChord(answer).toUpperCase() === window.normalizeChord(data.sevenths[degree]).toUpperCase();
      }
      case window.QUESTION_TYPES.SEVENTH_SPELLING: {
        const correctSpelling = data.seventhSpelling[degree].map(window.accidentalToUnicode).map(n => n.toUpperCase()).join('');
        const userSpelling = answer.trim().split(/\s+/).map(window.accidentalToUnicode).join('').toUpperCase();
        return userSpelling === correctSpelling;
      }
    }
    return false;
  }

  startAdvancedPractice(mode) {
    window.learningState.isAdvancedMode = true;
    window.learningState.advancedModeType = mode;
    window.learningState.correctAnswerStreak = 0;
    window.learningState.usedDegrees = [];
    window.learningState.currentQuestion = null;
    if (mode === 'random_all') {
      const randomKey = Object.keys(window.quizData).filter(k => k !== window.learningState.lastAccidentalsKey);
      const availableChapters = Object.values(window.CHAPTERS).filter(chapter =>
        chapter.id !== window.QUESTION_TYPES.ACCIDENTALS_NAMES &&
        chapter.id !== window.QUESTION_TYPES.SEVENTH_SPELLING
      );
      const randomChapter = availableChapters[Math.floor(Math.random() * availableChapters.length)];
      const selectedKey = randomKey[Math.floor(Math.random() * randomKey.length)];
      window.learningState.currentQuestion = { key: selectedKey, chapterId: randomChapter.id };
      let text = '';
      let degree;
      switch (randomChapter.id) {
        case window.QUESTION_TYPES.ACCIDENTALS_COUNT: {
          text = `How many accidentals are in ${selectedKey} major?`;
          break;
        }
        case window.QUESTION_TYPES.SCALE_SPELLING: {
          text = `Spell the ${selectedKey} major scale.`;
          break;
        }
        case window.QUESTION_TYPES.TRIADS:
        case window.QUESTION_TYPES.SEVENTHS: {
          degree = [2, 3, 4, 5, 6, 7][Math.floor(Math.random() * 6)];
          window.learningState.currentQuestion.degree = degree;
          const chordType = randomChapter.id === window.QUESTION_TYPES.TRIADS ? 'triad' : 'seventh chord';
          const action = 'Name';
          text = `${action} the ${MusicUtils.ordinal(degree)} ${chordType} in ${selectedKey} major.`;
          break;
        }
      }
      this.appController.updateQuestionUI(text);
    } else if (mode === 'sevenths_only') {
      const randomKey = Object.keys(window.quizData).filter(k => k !== window.learningState.lastAccidentalsKey);
      const randomChapter = window.CHAPTERS.SEVENTH_SPELLING;
      const selectedKey = randomKey[Math.floor(Math.random() * randomKey.length)];
      window.learningState.currentQuestion = { key: selectedKey, chapterId: randomChapter.id };
      const degree = [2, 3, 4, 5, 6, 7][Math.floor(Math.random() * 6)];
      window.learningState.currentQuestion.degree = degree;
      const chordType = 'seventh chord';
      const action = 'Spell';
      const text = `${action} the ${MusicUtils.ordinal(degree)} ${chordType} in ${selectedKey} major.`;
      this.appController.updateQuestionUI(text);
    }
  }
} 