// LEGACY FILE - COMPLETELY DISABLED
// This file has been replaced by the new modular architecture
// Only essential global functions are preserved for compatibility

// Preserve essential global functions for compatibility
window.resetQuiz = function() {
    if (window.resetLearningState) {
        window.resetLearningState();
    }
    // Explicitly clear any custom group and advanced mode state
    if (window.learningState) {
        window.learningState.customGroup = null;
        window.learningState.mode = window.MODES ? window.MODES.LINEAR : 'linear';
        window.learningState.currentKeyIndex = 0;
        window.learningState.currentChapterIndex = 0;
        // Clear advanced mode flags
        window.learningState.isAdvancedMode = false;
        window.learningState.advancedModeType = null;
    }
    if (window.saveLearningState) {
        window.saveLearningState();
    }
    // Clear any feedback messages
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }
    // Clear the answer input
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.value = '';
    }
    // Use new modular system to ask a fresh question
    if (window.appController && window.appController.generateAndDisplayQuestion) {
        window.appController.generateAndDisplayQuestion();
    }
};

// Initialize landing page functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('Music Theory Practice - Landing Page Loaded');
  const startButton = document.querySelector('a[href="/practice"]');
  if (startButton) {
    startButton.addEventListener('click', (e) => {
      console.log('User navigating to practice');
    });
  }
});

// ALL OTHER LEGACY CODE DISABLED - USING NEW MODULAR ARCHITECTURE 