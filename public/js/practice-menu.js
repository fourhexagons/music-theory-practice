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
    
    // Validate that required functions are available
    if (!window.resetLearningState || !window.getLearningState || !window.saveLearningState) {
      console.error('Required functions not available for difficulty selection');
      return;
    }
    
    // Reset learning state for new difficulty
    window.resetLearningState();
    
    // Get the state
    const state = window.getLearningState();
    
    // Define difficulty modes with their key groups
    const difficultyModes = {
      'no-accidentals': {
        keys: ['C'],
        mode: 'linear',
        description: 'No Accidentals - C major only'
      },
      '1-3-sharps': {
        keys: ['G', 'D', 'A'],
        mode: 'random_keys_linear_chapters',
        description: '1-3 Sharps - G, D, A keys'
      },
      '1-3-flats': {
        keys: ['F', 'Bb', 'Eb'],
        mode: 'random_keys_linear_chapters',
        description: '1-3 Flats - F, Bb, Eb keys'
      },
      '4-6-sharps': {
        keys: ['E', 'B', 'F#'],
        mode: 'random_keys_linear_chapters',
        description: '4-6 Sharps - E, B, F# keys'
      },
      '4-6-flats': {
        keys: ['Ab', 'Db', 'Gb'],
        mode: 'random_keys_linear_chapters',
        description: '4-6 Flats - Ab, Db, Gb keys'
      },
      'full-random': {
        keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'],
        mode: 'random_all',
        description: 'Full Random - All keys'
      },
      'spelling-random-sevenths': {
        keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'],
        mode: 'sevenths_only',
        description: 'Sevenths Only - All keys'
      }
    };
    
    const selectedMode = difficultyModes[difficulty];
    if (!selectedMode) {
      console.error(`Unknown difficulty: ${difficulty}`);
      return;
    }
    
    // Set up the custom learning path for this difficulty
    const customGroup = {
      name: selectedMode.description,
      keys: selectedMode.keys,
      mode: selectedMode.mode,
      chapters: window.CORE_CHAPTERS || [
        window.CHAPTERS.ACCIDENTALS_COUNT,
        window.CHAPTERS.ACCIDENTALS_NAMES,
        window.CHAPTERS.SCALE_SPELLING,
        window.CHAPTERS.TRIADS
      ],
      requiredStreak: 3
    };
    
    // Store the custom group in the learning state
    state.customGroup = customGroup;
    state.mode = selectedMode.mode;
    state.currentKeyIndex = 0;
    state.currentChapterIndex = 0;
    state.usedDegrees = [];
    state.correctAnswersInChapter = 0;
    state.correctAnswerStreak = 0;
    
    // Save the state
    window.saveLearningState();
    
    // Start the practice
    if (selectedMode.mode === 'random_all' || selectedMode.mode === 'sevenths_only') {
      if (window.startAdvancedPractice) {
        window.startAdvancedPractice(selectedMode.mode);
      } else {
        console.error('startAdvancedPractice function not available');
      }
    } else {
      // For linear and random_keys_linear_chapters modes, ask a new question
      if (window.askQuestion) {
        window.askQuestion();
      } else {
        console.error('askQuestion function not available');
      }
    }
    
    console.log(`Successfully switched to difficulty: ${difficulty} (${selectedMode.description})`);
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
      
      // Determine current difficulty based on custom group
      let currentDifficulty = null;
      if (state.customGroup) {
        const groupName = state.customGroup.name;
        if (groupName.includes('No Accidentals')) {
          currentDifficulty = 'no-accidentals';
        } else if (groupName.includes('1-3 Sharps')) {
          currentDifficulty = '1-3-sharps';
        } else if (groupName.includes('1-3 Flats')) {
          currentDifficulty = '1-3-flats';
        } else if (groupName.includes('4-6 Sharps')) {
          currentDifficulty = '4-6-sharps';
        } else if (groupName.includes('4-6 Flats')) {
          currentDifficulty = '4-6-flats';
        } else if (groupName.includes('Full Random')) {
          currentDifficulty = 'full-random';
        } else if (groupName.includes('Sevenths Only')) {
          currentDifficulty = 'spelling-random-sevenths';
        }
      } else {
        // For standard learning path, determine difficulty from mode
        const modeToDifficulty = {
          'linear': 'no-accidentals',
          'random_keys_linear_chapters': 'no-accidentals',
          'random_all': 'full-random',
          'sevenths_only': 'spelling-random-sevenths'
        };
        currentDifficulty = modeToDifficulty[state.mode];
      }
      
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
    
    // If there's a custom group, use its keys
    if (state.customGroup) {
      const availableKeys = state.customGroup.keys;
      
      // Update key options visibility
      this.menuOptions.forEach(option => {
        if (option.dataset.key) {
          const isAvailable = availableKeys.includes(option.dataset.key);
          option.style.display = isAvailable ? 'block' : 'none';
          option.disabled = !isAvailable;
        }
      });
      return;
    }
    
    // For standard learning path, show all keys
    this.menuOptions.forEach(option => {
      if (option.dataset.key) {
        option.style.display = 'block';
        option.disabled = false;
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
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/practice' || window.location.pathname === '/practice.html') {
    window.practiceMenu = new PracticeMenu();
  }
}); 