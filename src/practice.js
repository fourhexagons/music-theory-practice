// Import all dependencies in correct order
import './styles/variables.css';
import './styles/style.css';
import './styles/components/menu.css';

// Import utilities first
import './utils/errorHandler.js';
import './utils/helpers.js';
import './utils/normalization.js';
import './utils/validation.js';
import './utils/accessibility.js';
import './utils/performance.js';
import './utils/lazyLoader.js';

// Import data
import './data/quizData.js';

// Import state management
import './state/learningState.js';

// Import components
import './components/practice-menu.js';

// Import the new modular architecture
import { AppController } from './modules/ui/controllers/AppController.js';

// Initialize practice app
class PracticeApp {
  constructor() {
    this.controller = new AppController();
  }

  async initialize() {
    try {
      console.log('Music Theory Practice - Practice App Loading...');
      // Initialize the app controller
      await this.controller.initialize();
      console.log('Music Theory Practice - Practice App Loaded Successfully');
    } catch (error) {
      console.error('Failed to initialize practice app:', error);
      this.showFallbackError();
    }
  }

  showFallbackError() {
    const container = document.getElementById('app-container');
    if (container) {
      container.innerHTML = `
        <div class="error-container">
          <h2>Loading Error</h2>
          <p>There was an error loading the practice application.</p>
          <button onclick="window.location.reload()" class="btn">Reload Page</button>
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PracticeApp();
  app.initialize();
}); 