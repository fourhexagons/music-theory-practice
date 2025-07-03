/**
 * State Management Service
 * Centralized state management for learning progression
 */
export class StateManager {
  constructor(learningState) {
    this.learningState = learningState;
    this.quizData = window.quizData; // Access to quiz data for C major logic
  }

  getCurrentLevel() {
    return window.learningPath[this.learningState.currentGroup];
  }

  getCurrentGroup() {
    return window.getCurrentGroup();
  }

  getCurrentKey(mode) {
    const group = this.getCurrentGroup();
    if (!group) return null;
    
    if (mode === 'linear') {
      return group.keys[this.learningState.currentKeyIndex];
    } else {
      // For random modes, use global logic
      return window.getCurrentKey(mode);
    }
  }

  getCurrentChapter() {
    const group = this.getCurrentGroup();
    if (!group) return null;
    
    const currentChapterIndex = this.learningState.currentChapterIndex;
    const currentChapter = group.chapters[currentChapterIndex];
    
    // ✅ CORRECT LOGIC: Only skip accNotes for C major (accidentals === 0)
    if (currentChapter && currentChapter.id === 'accNotes') {
      const key = this.getCurrentKey(group.mode);
      if (key && this.quizData[key] && this.quizData[key].accidentals === 0) {
        // Skip accNotes only for C major
        return group.chapters[currentChapterIndex + 1] || group.chapters[0];
      }
    }
    
    return currentChapter;
  }

  advanceQuestionPointer() {
    const group = this.getCurrentGroup();
    
    if (group.mode === 'linear') {
      // For linear mode, advance chapter normally
      this.learningState.currentChapterIndex++;
      
      // If the key is C and we would now ask to NAME the accidentals, skip it.
      const key = group.keys[this.learningState.currentKeyIndex];
      const nextChapter = group.chapters[this.learningState.currentChapterIndex];
      if (key === 'C' && nextChapter && nextChapter.id === 'accNotes') {
        this.learningState.currentChapterIndex++; // Skip ahead
      }
      
      if (this.learningState.currentChapterIndex >= group.chapters.length) {
        this.learningState.currentChapterIndex = 0;
        this.learningState.usedDegrees = []; // Reset for triad questions in next chapter
      }
    } else {
      // For random modes, advance chapter normally
      this.learningState.currentChapterIndex++;
      
      if (this.learningState.currentChapterIndex >= group.chapters.length) {
        this.learningState.currentChapterIndex = 0;
        this.learningState.currentKeyIndex = 0;
        // Don't reset correctAnswerStreak here - it should only reset on level advance or incorrect answer
        // This allows b-levels with TRIADS_ONLY_CHAPTERS to accumulate streaks properly
      }
    }
  }

  advanceLevel() {
    this.learningState.currentGroup++;
    this.learningState.currentChapterIndex = 0;
    this.learningState.currentKeyIndex = 0;
    this.learningState.correctAnswerStreak = 0;
    
    // Clear used combinations when advancing to new level (for b-level combination prevention)
    if (window.clearUsedCombinations) {
      window.clearUsedCombinations();
    }
  }

  handleCorrectAnswer() {
    console.log('🔧 STATEMANAGER DEBUG: handleCorrectAnswer called');
    console.log('🔧 STATEMANAGER DEBUG: isAdvancedMode:', this.learningState.isAdvancedMode);
    console.log('🔧 STATEMANAGER DEBUG: advancedModeType:', this.learningState.advancedModeType);
    console.log('🔧 STATEMANAGER DEBUG: currentQuestion:', this.learningState.currentQuestion);
    
    // Check if StateManager's learningState is the same object as window.learningState
    console.log('🔧 STATEMANAGER DEBUG: Same object?', this.learningState === window.learningState);
    console.log('🔧 STATEMANAGER DEBUG: window.learningState.isAdvancedMode:', window.learningState.isAdvancedMode);
    console.log('🔧 STATEMANAGER DEBUG: window.learningState.advancedModeType:', window.learningState.advancedModeType);
    
    const group = this.getCurrentGroup();
    console.log('🔧 STATEMANAGER DEBUG: currentGroup:', group);

    // Handle advanced mode separately
    if (this.learningState.isAdvancedMode) {
      console.log('🔧 STATEMANAGER DEBUG: Calling handleAdvancedModeProgression');
      return this.handleAdvancedModeProgression();
    }

    console.log('🔧 STATEMANAGER DEBUG: Not in advanced mode, proceeding with normal progression');

    // Single-key custom group logic
    if (this.learningState.customGroup && group.keys.length === 1) {
      return this.handleSingleKeyProgression(group);
    }

    // Normal progression logic
    return this.handleNormalProgression(group);
  }

  handleAdvancedModeProgression() {
    console.log('🔧 STATEMANAGER DEBUG: handleAdvancedModeProgression called');
    console.log('🔧 STATEMANAGER DEBUG: currentQuestion:', this.learningState.currentQuestion);
    
    // Handle A/B pair logic for accidentals questions
    if (this.learningState.currentQuestion && 
        this.learningState.currentQuestion.chapterId === 'accCount' &&
        window.quizData[this.learningState.currentQuestion.key].accidentals > 0) {
      
      console.log('🔧 STATEMANAGER DEBUG: Handling A/B pair for accCount question');
      
      // Ask naming question for the same key
      const key = this.learningState.currentQuestion.key;
      this.learningState.currentQuestion = { key: key, chapterId: 'accNotes' };
      return {
        action: 'askNaming',
        text: `Name the accidentals in ${key} major.`
      };
    } else {
      console.log('🔧 STATEMANAGER DEBUG: Not an A/B pair case, returning startAdvanced');
      
      // Start new random question
      return { action: 'startAdvanced' };
    }
  }

  handleSingleKeyProgression(group) {
    const currentChapter = group.chapters[this.learningState.currentChapterIndex];
    
    if (currentChapter.id === 'triads') {
      this.learningState.correctChordAnswersForCurrentKey++;
      if (this.learningState.currentQuestion && this.learningState.currentQuestion.degree) {
        this.learningState.usedDegrees.push(this.learningState.currentQuestion.degree);
      }
      
      if (this.learningState.correctChordAnswersForCurrentKey >= 3) {
        this.learningState.correctChordAnswersForCurrentKey = 0;
        this.learningState.usedDegrees = [];
      }
      
      this.learningState.currentChapterIndex = group.chapters.findIndex(ch => ch.id === 'triads');
    } else {
      this.advanceQuestionPointer();
      const triadsIdx = group.chapters.findIndex(ch => ch.id === 'triads');
      if (this.learningState.currentChapterIndex >= triadsIdx) {
        this.learningState.currentChapterIndex = triadsIdx;
        this.learningState.usedDegrees = [];
      }
    }
    
    return { action: 'askQuestion' };
  }

  handleNormalProgression(group) {
    if (group.mode === 'linear') {
      const currentChapter = group.chapters[this.learningState.currentChapterIndex];
      if (currentChapter.id === 'triads') {
        this.learningState.correctChordAnswersForCurrentKey++;
        if (this.learningState.currentQuestion && this.learningState.currentQuestion.degree) {
          this.learningState.usedDegrees.push(this.learningState.currentQuestion.degree);
        }
        if (this.learningState.correctChordAnswersForCurrentKey >= 3) {
          this.learningState.correctChordAnswersForCurrentKey = 0;
          this.learningState.usedDegrees = [];
          this.learningState.currentKeyIndex++;
          if (this.learningState.currentKeyIndex >= group.keys.length) {
            if (this.learningState.customGroup) {
              this.learningState.currentKeyIndex = 0;
              this.learningState.currentChapterIndex = 0;
            } else {
              this.advanceLevel();
            }
          } else {
            this.learningState.currentChapterIndex = 0;
          }
        }
      } else {
        this.advanceQuestionPointer();
      }
    } else if (group.mode === 'random_keys_linear_chapters' && this.learningState.customGroup) {
      // Handle key sequence progression for island levels
      return this.handleKeySequenceProgression(group);
    } else if (group.mode === 'random_keys_linear_chapters') {
      // Handle RANDOM_KEYS_LINEAR_CHAPTERS mode with accidentals pairing
      if (this.learningState.currentQuestion && this.learningState.currentQuestion.chapterId === 'accCount') {
        const key = this.learningState.currentQuestion.key;
        
        // Check if this key has accidentals to name
        if (window.quizData[key] && window.quizData[key].accidentals > 0) {
          // Set up pairing state for accNotes question
          if (this.learningState.accidentalsPairState) {
            this.learningState.accidentalsPairState.countAnswered = true;
          }
          
          // Move to accNotes chapter and let normal question generation handle it
          const accNotesChapterIndex = group.chapters.findIndex(ch => ch.id === 'accNotes');
          if (accNotesChapterIndex !== -1) {
            this.learningState.currentChapterIndex = accNotesChapterIndex;
          }
          
          // Let normal question generation create the accNotes question
          return { action: 'askQuestion' };
        } else {
          // C major case - no accidentals to name, proceed normally
          this.learningState.correctAnswerStreak++;
          if (this.learningState.correctAnswerStreak >= group.requiredStreak) {
            if (this.learningState.customGroup) {
              this.learningState.correctAnswerStreak = 0;
              this.learningState.currentKeyIndex = 0;
              this.learningState.currentChapterIndex = 0;
            } else {
              this.advanceLevel();
            }
          } else {
            this.advanceQuestionPointer();
          }
        }
      } else if (this.learningState.currentQuestion && this.learningState.currentQuestion.chapterId === 'accNotes' && 
                 this.learningState.accidentalsPairState && this.learningState.accidentalsPairState.inProgress) {
        // Completing accNotes part of a pair - end the pair and advance normally
        this.learningState.accidentalsPairState.inProgress = false;
        this.learningState.accidentalsPairState.countAnswered = false;
        this.learningState.accidentalsPairState.currentKey = null;
        
        this.learningState.correctAnswerStreak++;
        if (this.learningState.correctAnswerStreak >= group.requiredStreak) {
          if (this.learningState.customGroup) {
            this.learningState.correctAnswerStreak = 0;
            this.learningState.currentKeyIndex = 0;
            this.learningState.currentChapterIndex = 0;
          } else {
            this.advanceLevel();
          }
        } else {
          this.advanceQuestionPointer();
        }
      } else {
        // Normal progression for non-accidental questions
        this.learningState.correctAnswerStreak++;
        if (this.learningState.correctAnswerStreak >= group.requiredStreak) {
          if (this.learningState.customGroup) {
            this.learningState.correctAnswerStreak = 0;
            this.learningState.currentKeyIndex = 0;
            this.learningState.currentChapterIndex = 0;
          } else {
            this.advanceLevel();
          }
        } else {
          this.advanceQuestionPointer();
        }
      }
    } else {
              // All other modes (e.g., naming_triads)
      this.learningState.correctAnswerStreak++;
      if (this.learningState.correctAnswerStreak >= group.requiredStreak) {
        if (this.learningState.customGroup) {
          this.learningState.correctAnswerStreak = 0;
          this.learningState.currentKeyIndex = 0;
          this.learningState.currentChapterIndex = 0;
        } else {
          this.advanceLevel();
        }
      } else {
        this.advanceQuestionPointer();
      }
    }
    
    return { action: 'askQuestion' };
  }

  handleIncorrectAnswer() {
    this.learningState.correctAnswerStreak = 0;
    return { action: 'showIncorrect' };
  }

  /**
   * Handles progression logic for key sequence-based island levels
   * @param {Object} group - The current group configuration
   * @returns {Object} - Action to take next
   */
  handleKeySequenceProgression(group) {
    const currentQuestion = this.learningState.currentQuestion;
    if (!currentQuestion) {
      return { action: 'askQuestion' };
    }

    console.log('🔧 STATEMANAGER: Handling key sequence progression', {
      chapterId: currentQuestion.chapterId,
      key: currentQuestion.key,
      sequenceState: this.learningState.keySequenceState
    });

    // Advance the key sequence
    const isSequenceComplete = window.advanceKeySequence(currentQuestion.chapterId);
    
    if (isSequenceComplete) {
      console.log('🔧 STATEMANAGER: Key sequence completed, starting new sequence');
      // Reset chapter index to start with accCount for new key
      this.learningState.currentChapterIndex = 0;
    } else {
      // Continue with current sequence - advance to next chapter
      if (currentQuestion.chapterId !== 'triads') {
        this.advanceQuestionPointer();
      }
      // For triads, we stay on the same chapter to ask more triad questions
    }

    return { action: 'askQuestion' };
  }

  resetState() {
    if (window.resetLearningState) {
      window.resetLearningState();
    }
    
    if (this.learningState) {
      this.learningState.customGroup = null;
      this.learningState.mode = 'linear';
      this.learningState.currentKeyIndex = 0;
      this.learningState.currentChapterIndex = 0;
    }
    
    // Clear used combinations when resetting
    if (window.clearUsedCombinations) {
      window.clearUsedCombinations();
    }
    
    if (window.saveLearningState) {
      window.saveLearningState();
    }
  }
} 