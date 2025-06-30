// Modern module imports
import './styles/variables.css';
import './styles/style.css';

// Import utilities and error handling
import './utils/errorHandler.js';
import './utils/accessibility.js';
import './utils/performance.js';
import './utils/lazyLoader.js';
import { AppController } from './modules/ui/controllers/AppController.js';
import { QuizService } from './modules/business/services/QuizService.js';

// Initialize app and services
const appController = new AppController();
const quizService = new QuizService(appController);

// Expose for global access (for backward compatibility)
window.appController = appController;
window.quizService = quizService;

// Wire up global functions for menu and legacy code
window.askQuestion = () => quizService.askQuestion();
window.startAdvancedPractice = (mode) => quizService.startAdvancedPractice(mode);
window.handleAnswerSubmit = (e) => quizService.handleAnswerSubmit(e);
window.checkAnswer = (answer) => quizService.checkAnswer(answer);

// App initialization
function initializeApp() {
  appController.renderAppLayout();
  quizService.askQuestion();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
}); 