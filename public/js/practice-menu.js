// Practice Menu Overlay Component
// Handles the practice menu overlay functionality with Ableton-inspired design

class PracticeMenu {
  constructor() {
    this.isOpen = false;
    this.currentSection = null;
    this.menuButton = document.getElementById('practice-menu-button');
    this.menuBar = document.getElementById('practice-menu-bar');
    this.overlay = document.getElementById('practice-menu-overlay');
    this.menuNav = document.querySelector('.practice-menu-nav');
    this.optionsArea = document.querySelector('.practice-menu-options-area');
    this.menuLinks = document.querySelectorAll('.practice-menu-link');
    this.optionsAreas = document.querySelectorAll('.practice-menu-options');
    this.menuOptions = document.querySelectorAll('.practice-menu-option');
    this.body = document.body;
    this.isMobile = window.innerWidth <= 893;
    this.sectionNames = {
      'difficulty': 'Difficulty',
      'keys': 'Keys',
      // Add more if needed
    };
    this.init();
  }

  init() {
    this.loadMenuState();
    this.bindEvents();
    this.updateMenuDisplay();
    
    // Initialize menu with current app state
    this.initializeWithCurrentState();
  }

  initializeWithCurrentState() {
    // Wait a bit for the app to fully load
    setTimeout(() => {
      this.updateCurrentSelections();
      this.updateProgressDisplay();
    }, 100);
  }

  bindEvents() {
    // Make entire menu bar clickable (desktop only)
    this.menuBar.addEventListener('click', (e) => {
      if (!this.isMobile) {
        this.toggleMenu();
      }
    });

    // Hamburger icon always clickable
    this.menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Section navigation
    this.menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const section = e.target.dataset.section;
        this.handleSectionClick(section);
      });
    });

    // Menu options
    this.menuOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleMenuOption(e.target);
      });
    });

    // Back nav for nested menus (mobile)
    this.optionsArea.addEventListener('click', (e) => {
      if (e.target.classList.contains('practice-menu-back-nav')) {
        this.currentSection = null;
        this.saveMenuState();
        this.updateMenuDisplay();
      }
    });

    // Close menu when clicking outside overlay (not on bar)
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.closeMenu();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 893;
      this.updateMenuDisplay();
    });
  }

  handleSectionClick(section) {
    if (section === 'start-over') {
      this.handleStartOver();
      return;
    }
    this.currentSection = section;
    this.saveMenuState();
    this.updateMenuDisplay();
  }

  handleStartOver() {
    if (window.resetQuiz) {
      window.resetQuiz();
    }
    this.closeMenu();
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isOpen = true;
    this.body.classList.add('practice-menu-open');
    this.overlay.classList.add('open');
    this.saveMenuState();
    this.updateMenuDisplay();
    
    // Update progress display when menu opens
    setTimeout(() => {
      this.updateProgressDisplay();
    }, 50);
  }

  closeMenu() {
    this.isOpen = false;
    this.currentSection = null;
    this.body.classList.remove('practice-menu-open');
    this.overlay.classList.remove('open');
    this.saveMenuState();
    this.updateMenuDisplay();
  }

  handleMenuOption(option) {
    const key = option.dataset.key;
    const difficulty = option.dataset.difficulty;
    
    if (key) {
      this.handleKeySelection(key);
    } else if (difficulty) {
      this.handleDifficultySelection(difficulty);
    }
    this.closeMenu();
  }

  handleKeySelection(key) {
    console.log(`Attempting to switch to key: ${key}`);
    
    // Validate that required functions are available
    if (!window.getLearningState || !window.getCurrentGroup) {
      console.error('Required functions not available for key selection');
      return;
    }
    
    const state = window.getLearningState();
    const currentGroup = window.getCurrentGroup();
    
    if (!currentGroup || !currentGroup.keys) {
      console.error('No current group or keys available');
      return;
    }
    
    const keyIndex = currentGroup.keys.indexOf(key);
    if (keyIndex === -1) {
      console.warn(`Key ${key} not found in current group. Available keys: ${currentGroup.keys.join(', ')}`);
      return;
    }
    
    // Update the learning state
    state.currentKeyIndex = keyIndex;
    state.currentChapterIndex = 0; // Reset to first chapter
    state.usedDegrees = []; // Reset used degrees
    state.correctAnswersInChapter = 0; // Reset progress
    
    // Save the state
    if (window.saveLearningState) {
      window.saveLearningState();
    }
    
    // Generate a new question for the selected key
    if (window.askQuestion) {
      window.askQuestion();
    }
    
    console.log(`Successfully switched to key: ${key}`);
  }

  handleDifficultySelection(difficulty) {
    console.log(`Attempting to switch to difficulty: ${difficulty}`);
    
    // Map difficulty options to app modes
    const difficultyMap = {
      'no-accidentals': 'no-accidentals',
      '1-3-sharps': '1-3-sharps', 
      '1-3-flats': '1-3-flats',
      '4-6-sharps': '4-6-sharps',
      '4-6-flats': '4-6-flats',
      'full-random': 'random_all',
      'spelling-random-sevenths': 'sevenths_only'
    };
    
    const mode = difficultyMap[difficulty];
    if (!mode) {
      console.error(`Unknown difficulty: ${difficulty}`);
      return;
    }
    
    // Validate that required functions are available
    if (!window.resetLearningState || !window.getLearningState || !window.saveLearningState) {
      console.error('Required functions not available for difficulty selection');
      return;
    }
    
    // Reset learning state for new difficulty
    window.resetLearningState();
    
    // Set the mode
    const state = window.getLearningState();
    state.mode = mode;
    
    // Save the state
    window.saveLearningState();
    
    // Start advanced practice for random modes
    if (mode === 'random_all' || mode === 'sevenths_only') {
      if (window.startAdvancedPractice) {
        window.startAdvancedPractice(mode);
      } else {
        console.error('startAdvancedPractice function not available');
      }
    } else {
      // For linear modes, just ask a new question
      if (window.askQuestion) {
        window.askQuestion();
      } else {
        console.error('askQuestion function not available');
      }
    }
    
    console.log(`Successfully switched to difficulty: ${difficulty} (mode: ${mode})`);
  }

  saveMenuState() {
    const menuState = {
      isOpen: this.isOpen,
      currentSection: this.currentSection
    };
    localStorage.setItem('practiceMenuState', JSON.stringify(menuState));
  }

  loadMenuState() {
    const savedState = localStorage.getItem('practiceMenuState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.isOpen = state.isOpen || false;
        this.currentSection = state.currentSection || null;
      } catch (e) {
        console.warn('Failed to load menu state:', e);
      }
    }
  }

  updateMenuDisplay() {
    // Highlight active section link
    this.menuLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === this.currentSection);
    });
    
    // Show only the current options area
    this.optionsAreas.forEach(area => {
      if (this.currentSection) {
        area.classList.toggle('active', area.id === `${this.currentSection}-section`);
      } else {
        area.classList.remove('active');
      }
    });
    
    // Handle mobile menu behavior
    if (this.isMobile) {
      // Only hamburger is clickable
      this.menuBar.style.pointerEvents = 'none';
      this.menuButton.style.pointerEvents = 'auto';
      if (this.currentSection) {
        // Show nested menu (hide top level)
        this.menuNav.classList.add('mobile-nested');
        this.optionsArea.classList.add('mobile-nested');
        // Show back nav text
        this.showBackNav(true);
      } else {
        // Show top level menu
        this.menuNav.classList.remove('mobile-nested');
        this.optionsArea.classList.remove('mobile-nested');
        this.showBackNav(false);
      }
    } else {
      // Desktop: bar is fully clickable
      this.menuBar.style.pointerEvents = 'auto';
      this.menuButton.style.pointerEvents = 'auto';
      this.menuNav.classList.remove('mobile-nested');
      this.optionsArea.classList.remove('mobile-nested');
      this.showBackNav(false);
    }
    
    // Update visual feedback for current selections
    this.updateCurrentSelections();
  }

  updateCurrentSelections() {
    // Update key selection feedback
    if (window.getLearningState && window.getCurrentGroup) {
      const state = window.getLearningState();
      const currentGroup = window.getCurrentGroup();
      
      if (currentGroup && currentGroup.keys) {
        const currentKey = currentGroup.keys[state.currentKeyIndex];
        this.menuOptions.forEach(option => {
          if (option.dataset.key) {
            option.classList.toggle('current-selection', option.dataset.key === currentKey);
          }
        });
      }
    }
    
    // Update difficulty selection feedback
    if (window.getLearningState) {
      const state = window.getLearningState();
      const currentMode = state.mode;
      
      // Map mode back to difficulty option
      const modeToDifficulty = {
        'no-accidentals': 'no-accidentals',
        '1-3-sharps': '1-3-sharps',
        '1-3-flats': '1-3-flats',
        '4-6-sharps': '4-6-sharps',
        '4-6-flats': '4-6-flats',
        'random_all': 'full-random',
        'sevenths_only': 'spelling-random-sevenths'
      };
      
      const currentDifficulty = modeToDifficulty[currentMode];
      if (currentDifficulty) {
        this.menuOptions.forEach(option => {
          if (option.dataset.difficulty) {
            option.classList.toggle('current-selection', option.dataset.difficulty === currentDifficulty);
          }
        });
      }
    }
    
    // Update available keys based on current difficulty
    this.updateAvailableKeys();
  }

  updateAvailableKeys() {
    if (!window.getLearningState) return;
    
    const state = window.getLearningState();
    const currentMode = state.mode;
    
    // Define which keys are available for each mode
    const keyAvailability = {
      'no-accidentals': ['C'],
      '1-3-sharps': ['G', 'D', 'A'],
      '1-3-flats': ['F', 'Bb', 'Eb'],
      '4-6-sharps': ['E', 'B', 'F#'],
      '4-6-flats': ['Ab', 'Db', 'Gb'],
      'random_all': ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'],
      'sevenths_only': ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb']
    };
    
    const availableKeys = keyAvailability[currentMode] || [];
    
    // Update key options visibility
    this.menuOptions.forEach(option => {
      if (option.dataset.key) {
        const isAvailable = availableKeys.includes(option.dataset.key);
        option.style.display = isAvailable ? 'block' : 'none';
        option.disabled = !isAvailable;
      }
    });
  }

  showBackNav(show) {
    let backNav = this.optionsArea.querySelector('.practice-menu-back-nav');
    if (!backNav) {
      backNav = document.createElement('div');
      backNav.className = 'practice-menu-back-nav';
      this.optionsArea.prepend(backNav);
    }
    if (show && this.currentSection && this.sectionNames[this.currentSection]) {
      backNav.textContent = ` ${this.sectionNames[this.currentSection]}`.replace('\u001c', '‹');
      this.optionsArea.classList.add('show-back-nav');
      backNav.style.display = 'block';
    } else {
      this.optionsArea.classList.remove('show-back-nav');
      backNav.style.display = 'none';
    }
  }

  updateProgressDisplay() {
    if (!window.getLearningState || !window.getCurrentGroup) return;
    
    const state = window.getLearningState();
    const currentGroup = window.getCurrentGroup();
    
    if (!currentGroup) return;
    
    // Create or update progress display
    let progressDisplay = document.getElementById('menu-progress-display');
    if (!progressDisplay) {
      progressDisplay = document.createElement('div');
      progressDisplay.id = 'menu-progress-display';
      progressDisplay.className = 'menu-progress-display';
      this.overlay.querySelector('.practice-menu-overlay-inner').appendChild(progressDisplay);
    }
    
    const currentKey = currentGroup.keys[state.currentKeyIndex];
    const currentChapter = currentGroup.chapters[state.currentChapterIndex];
    
    let progressHTML = `
      <div class="progress-info">
        <h3>Current Progress</h3>
        <p><strong>Key:</strong> ${currentKey}</p>
        <p><strong>Chapter:</strong> ${currentChapter ? currentChapter.name : 'Unknown'}</p>
        <p><strong>Correct Answers:</strong> ${state.correctAnswersInChapter}</p>
        <p><strong>Streak:</strong> ${state.correctAnswerStreak}</p>
      </div>
    `;
    
    progressDisplay.innerHTML = progressHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/practice' || window.location.pathname === '/practice.html') {
    window.practiceMenu = new PracticeMenu();
  }
}); 