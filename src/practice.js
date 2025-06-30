// Import all dependencies in correct order
import './styles/variables.css';
import './styles/style.css';
import './styles/components/menu.css';

// Import utilities first
import './utils/errorHandler.js';
import './utils/helpers.js';
import './utils/normalization.js';
import './utils/validation.js';

// Import data
import './data/quizData.js';

// Import state management
import './state/learningState.js';

// Import components
import './components/practice-menu.js';

// Import main application logic (this will be large initially)
import './components/main-app.js';

// Initialize practice app
document.addEventListener('DOMContentLoaded', () => {
  console.log('Music Theory Practice - Practice App Loaded');
  // The existing initialization code from main.js will run
  // because it's imported above as main-app.js
}); 