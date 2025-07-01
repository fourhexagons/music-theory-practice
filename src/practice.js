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

// Import business modules to ensure global functions are available
import { MusicUtils } from './modules/business/utils/MusicUtils.js';

// Import the new modular architecture
import { AppController } from './modules/ui/controllers/AppController.js';

// Initialize practice app
class PracticeApp {
  constructor() {
    this.controller = new AppController();
  }

  async initialize() {
    try {
      import('./utils/logger.js').then(({ logger }) => {
        logger.appState('Practice App Loading...');
      }).catch(() => console.log('Music Theory Practice - Practice App Loading...'));
      
      // Ensure global functions are available (wait for all imports to complete)
      await this.ensureGlobalFunctions();
      
      // Initialize the app controller
      await this.controller.initialize();
      import('./utils/logger.js').then(({ logger }) => {
        logger.system('Practice App Loaded Successfully');
      }).catch(() => console.log('Music Theory Practice - Practice App Loaded Successfully'));
    } catch (error) {
      console.error('Failed to initialize practice app:', error);
      this.showFallbackError();
    }
  }

  async ensureGlobalFunctions() {
    // Wait a tick to ensure all imports have executed
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Verify required global functions are available
    const requiredFunctions = ['normalizeChord', 'wordToNumber', 'accidentalToUnicode', 'normalizeAccList'];
    const missing = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
    
    if (missing.length > 0) {
      console.error('Missing global functions:', missing);
      throw new Error(`Required global functions not available: ${missing.join(', ')}`);
    }
    
            import('./utils/logger.js').then(({ logger }) => {
          logger.debug('Global functions verified:', requiredFunctions);
        }).catch(() => {
          if (import.meta.env?.DEV) console.log('Global functions verified:', requiredFunctions);
        });
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