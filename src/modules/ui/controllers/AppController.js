/**
 * Application Controller
 * Orchestrates UI components and business services
 */
import { QuestionDisplay } from '../components/QuestionDisplay.js';
import { AnswerForm } from '../components/AnswerForm.js';
import { AppLayout } from '../components/AppLayout.js';
import { QuestionGenerator } from '../../business/services/QuestionGenerator.js';
import { AnswerValidator } from '../../business/services/AnswerValidator.js';
import { StateManager } from '../../business/services/StateManager.js';
import { MusicUtils } from '../../business/utils/MusicUtils.js';

export class AppController {
  constructor() {
    this.layout = new AppLayout();
    this.questionDisplay = null;
    this.answerForm = null;
    this.questionGenerator = null;
    this.answerValidator = null;
    this.stateManager = null;
    
    this.currentQuestion = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Wait for required dependencies
      await this.waitForDependencies();
      // Initialize performance features
      await this.initializePerformanceFeatures();
      
      // Initialize services
      this.stateManager = new StateManager(window.learningState);
      this.questionGenerator = new QuestionGenerator(window.quizData, window.learningState, this.stateManager);
      this.answerValidator = new AnswerValidator(window.quizData);
      
      // Setup UI
      this.setupUI();
      
      // Initialize learning state
      if (window.initLearningState) {
        window.initLearningState();
      }
      
      this.isInitialized = true;
      
      // Start the practice session
      this.generateAndDisplayQuestion();
      
      // End performance timing
      window.performanceMonitor.endTiming('app-initialization');
      
    } catch (error) {
      console.error('Failed to initialize app controller:', error);
      this.showError('Failed to initialize the application. Please refresh the page.');
    }
  }

  async waitForDependencies() {
    // Wait for essential global objects to be available
    const maxAttempts = 50;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      if (window.quizData && window.learningState && window.getCurrentGroup) {
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    throw new Error('Required dependencies not available');
  }

  async initializePerformanceFeatures() {
    try {
      // Start performance monitoring for app initialization
      window.performanceMonitor.startTiming('app-initialization');
      // Skip module preloading since Vite bundles everything
      import('../../../utils/logger.js').then(({ logger }) => {
        logger.debug('Using Vite bundled modules - no preloading needed');
      }).catch(() => {
        if (import.meta.env?.DEV) console.log('📦 Using Vite bundled modules - no preloading needed');
      });
    } catch (error) {
      console.warn('Performance features failed to initialize:', error);
    }
  }

  setupUI() {
    // Render the practice layout
    this.layout.renderPracticeLayout();
    
    // Initialize UI components
    this.questionDisplay = new QuestionDisplay();
    this.answerForm = new AnswerForm();
    
    // Set up answer submission handler
    this.answerForm.setSubmitHandler((answer) => this.handleAnswerSubmit(answer));
    
    // Expose global functions for menu system compatibility
    this.exposeGlobalFunctions();
  }

  generateAndDisplayQuestion() {
    try {
      const question = this.questionGenerator.generateQuestion();
      
      if (!question) {
        this.layout.showCompletionMessage();
        return;
      }
      
      this.currentQuestion = question;
      window.learningState.currentQuestion = question;
      
      this.questionDisplay.render(question.text);
      this.answerForm.clearFeedback();
      
    } catch (error) {
      console.error('Error generating question:', error);
      this.showError('Error generating question. Please try again.');
    }
  }

  handleAnswerSubmit(userAnswer) {
    console.log('🎯 APPCONTROLLER DEBUG: handleAnswerSubmit called with:', userAnswer);
    console.log('🎯 APPCONTROLLER DEBUG: currentQuestion:', this.currentQuestion);
    
    if (!this.currentQuestion) {
      this.showError('No current question available.');
      return;
    }

    try {
      const isCorrect = this.answerValidator.validateAnswer(userAnswer, this.currentQuestion);
      
      if (isCorrect) {
        console.log('🎯 APPCONTROLLER DEBUG: Answer correct, calling handleCorrectAnswer');
        this.handleCorrectAnswer();
      } else {
        console.log('🎯 APPCONTROLLER DEBUG: Answer incorrect, calling handleIncorrectAnswer');
        this.handleIncorrectAnswer();
      }
      
    } catch (error) {
      console.error('Error validating answer:', error);
      this.showError('Error validating answer. Please try again.');
    }
  }

  handleCorrectAnswer() {
    console.log('🎯 APPCONTROLLER DEBUG: handleCorrectAnswer called');
    
    // Clear feedback and input
    this.answerForm.clearFeedback();
    this.answerForm.clearAnswer();
    
    // Use state manager to handle progression
    const result = this.stateManager.handleCorrectAnswer();
    console.log('🎯 APPCONTROLLER DEBUG: StateManager returned:', result);
    
    switch (result.action) {
      case 'startAdvanced':
        console.log('🎯 APPCONTROLLER DEBUG: Taking startAdvanced action');
        if (window.startAdvancedPractice) {
          window.startAdvancedPractice(window.learningState.advancedModeType);
        }
        break;
        
      case 'askNaming':
        console.log('🎯 APPCONTROLLER DEBUG: Taking askNaming action');
        console.log('🎯 APPCONTROLLER DEBUG: askNaming text:', result.text);
        // For A/B pairs, StateManager has already set the currentQuestion
        // We just need to update the UI with the provided text
        this.currentQuestion = window.learningState.currentQuestion;
        this.questionDisplay.render(result.text);
        this.answerForm.clearFeedback();
        break;
        
      case 'askQuestion':
      default:
        console.log('🎯 APPCONTROLLER DEBUG: Taking askQuestion action');
        this.generateAndDisplayQuestion();
        break;
    }
  }

  handleIncorrectAnswer() {
    this.answerForm.showFeedback('Incorrect. Try again.', 'incorrect');
    this.stateManager.handleIncorrectAnswer();
    // Don't clear input - let user edit their answer
  }

  showError(message) {
    this.answerForm.showFeedback(message, 'error');
  }

  // Expose global functions for backwards compatibility
  exposeGlobalFunctions() {
    window.askQuestion = () => this.generateAndDisplayQuestion();
    
    window.resetQuiz = () => {
      this.stateManager.resetState();
      this.answerForm.clearFeedback();
      this.answerForm.clearAnswer();
      this.generateAndDisplayQuestion();
    };
  }

  renderAppLayout() {
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = `
      <header class="app-header">
        <a href="/" class="logo-link">
          <img src="/images/lb-loop-logo-white-on-trans.png" alt="Logo" class="app-logo">
        </a>
      </header>
      <div class="main-content">
        <div class="quiz-section">
          <div class="question-display" id="question-display"></div>
          <div class="answer-container">
            <form id="answer-form">
              <input type="text" id="answer-input" placeholder="Your answer..." autocomplete="off">
              <button type="submit" id="submit-btn" class="btn">Submit</button>
            </form>
            <div class="feedback" id="feedback"></div>
          </div>
        </div>
      </div>
    `;
    // Advanced practice section
    const advancedRoot = document.getElementById('advanced-practice-root');
    if (advancedRoot) {
      advancedRoot.innerHTML = `
        <div class="advanced-practice">
          <h3>Advanced Practice</h3>
          <div class="practice-controls">
            <button id="advanced1-btn" class="btn">Randomize</button>
            <button id="advanced2-btn" class="btn">Sevenths</button>
          </div>
        </div>
      `;
    }
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Remove duplicate form binding - AnswerForm already handles this via setSubmitHandler
    // const form = document.getElementById('answer-form');
    // const submitBtn = document.getElementById('submit-btn');
    // if (form) {
    //   form.addEventListener('submit', (e) => this.handleAnswerSubmit(e));
    // }
    // if (submitBtn) {
    //   submitBtn.addEventListener('click', (e) => this.handleAnswerSubmit(e));
    // }
    
    // Only handle advanced practice buttons (not form submission)
    const advanced1Btn = document.getElementById('advanced1-btn');
    const advanced2Btn = document.getElementById('advanced2-btn');
    if (advanced1Btn) {
      advanced1Btn.addEventListener('click', () => window.startAdvancedPractice('random_all'));
    }
    if (advanced2Btn) {
      advanced2Btn.addEventListener('click', () => window.startAdvancedPractice('sevenths_only'));
    }
  }

  updateQuestionUI(text, clearInput = true) {
    const questionDisplay = document.getElementById('question-display');
    const answerInput = document.getElementById('answer-input');
    const feedback = document.getElementById('feedback');
    if (window.getCurrentLevel().mode === window.MODES.COMPLETE) {
      questionDisplay.textContent = 'Congratulations! You have completed all levels.';
      document.getElementById('answer-form').style.display = 'none';
    } else {
      document.getElementById('answer-form').style.display = 'flex';
      questionDisplay.textContent = text;
      if (clearInput && answerInput) {
        answerInput.value = '';
      }
      if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
      }
      if (answerInput) answerInput.focus();
    }
  }
} 