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
      this.questionGenerator = new QuestionGenerator(window.quizData, window.learningState);
      this.answerValidator = new AnswerValidator(window.quizData);
      this.stateManager = new StateManager(window.learningState);
      
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
      // Preload modules that might be needed soon
      if (window.lazyLoader) {
        const modulesToPreload = [
          './src/modules/business/services/QuestionGenerator.js',
          './src/modules/business/services/AnswerValidator.js'
        ];
        await window.lazyLoader.preloadModules(modulesToPreload);
      }
      // Start performance monitoring for app initialization
      window.performanceMonitor.startTiming('app-initialization');
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
    if (!this.currentQuestion) {
      this.showError('No current question available.');
      return;
    }

    try {
      const isCorrect = this.answerValidator.validateAnswer(userAnswer, this.currentQuestion);
      
      if (isCorrect) {
        this.handleCorrectAnswer();
      } else {
        this.handleIncorrectAnswer();
      }
      
    } catch (error) {
      console.error('Error validating answer:', error);
      this.showError('Error validating answer. Please try again.');
    }
  }

  handleCorrectAnswer() {
    // Clear feedback and input
    this.answerForm.clearFeedback();
    this.answerForm.clearAnswer();
    
    // Use state manager to handle progression
    const result = this.stateManager.handleCorrectAnswer();
    
    switch (result.action) {
      case 'askNaming':
        this.currentQuestion = window.learningState.currentQuestion;
        this.questionDisplay.render(result.text, false);
        break;
        
      case 'startAdvanced':
        if (window.startAdvancedPractice) {
          window.startAdvancedPractice(window.learningState.advancedModeType);
        }
        break;
        
      case 'askQuestion':
      default:
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
    
    window.startAdvancedPractice = (mode) => {
      window.learningState.isAdvancedMode = true;
      window.learningState.advancedModeType = mode;
      this.generateAndDisplayQuestion();
    };
    
    window.resetQuiz = () => {
      this.stateManager.resetState();
      this.answerForm.clearFeedback();
      this.answerForm.clearAnswer();
      this.generateAndDisplayQuestion();
    };
  }
} 