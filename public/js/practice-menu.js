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
    // Call updateCurrentSelections immediately (no setTimeout)
    this.updateCurrentSelections();
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
        e.preventDefault();
        e.stopPropagation();
        const section = e.target.dataset.section;
        this.handleSectionClick(section);
      });
    });

    // Menu options
    this.menuOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
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
    // Always set and update, even if already selected
    this.currentSection = section;
    this.lastSectionType = section;
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
    // Restore last section and nested selection if available
    if (this.currentSection == null && (this.lastSectionType || this.lastSelectedKey || this.lastSelectedDifficulty)) {
      if (this.lastSectionType) {
        this.currentSection = this.lastSectionType;
      } else if (this.lastSelectedKey) {
        this.currentSection = 'keys';
      } else if (this.lastSelectedDifficulty) {
        this.currentSection = 'difficulty';
      }
    }
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
      this.lastSectionType = 'keys';
      this.saveMenuState();
      this.handleKeySelection(key);
    } else if (difficulty) {
      this.lastSectionType = 'difficulty';
      this.saveMenuState();
      this.handleDifficultySelection(difficulty);
    }
    this.closeMenu();
  }

  handleKeySelection(key) {
    // Lock practice to the selected key only, like a custom group
    if (!window.resetLearningState || !window.getLearningState || !window.saveLearningState) {
      console.error('Required functions not available for key selection');
      return;
    }
    window.resetLearningState();
    const state = window.getLearningState();
    // Set up a custom group for the selected key
    const customGroup = {
      name: `Key: ${key}`,
      keys: [key],
      mode: 'linear',
      chapters: window.CORE_CHAPTERS || [
        window.CHAPTERS.ACCIDENTALS_COUNT,
        window.CHAPTERS.ACCIDENTALS_NAMES,
        window.CHAPTERS.SCALE_SPELLING,
        window.CHAPTERS.TRIADS
      ],
      requiredStreak: 3
    };
    state.customGroup = customGroup;
    state.mode = 'linear';
    state.currentKeyIndex = 0;
    state.currentChapterIndex = 0;
    state.usedDegrees = [];
    state.correctAnswersInChapter = 0;
    state.correctAnswerStreak = 0;
    window.saveLearningState();
    // Start the practice for the selected key
    if (window.askQuestion) {
      window.askQuestion();
    }
    // Update menu display to reflect selection
    this.updateMenuDisplay();
  }

  handleDifficultySelection(difficulty) {
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
        // For random_all mode, clear custom group to let advanced practice handle everything
        if (selectedMode.mode === 'random_all') {
          state.customGroup = null;
          window.saveLearningState();
        }
        // For sevenths_only mode, override the custom group chapters
        if (selectedMode.mode === 'sevenths_only') {
          state.customGroup.chapters = [{ id: 'seventhSpelling', name: 'Seventh Spelling' }];
          window.saveLearningState();
        }
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
  }

  saveMenuState() {
    // Save currentSection, lastSelectedKey, lastSelectedDifficulty, lastSectionType
    const state = window.getLearningState && window.getLearningState();
    const menuState = {
      isOpen: this.isOpen,
      currentSection: this.currentSection,
      lastSelectedKey: state && state.currentKeyIndex !== undefined && state.currentKeyIndex !== null && state.customGroup && state.customGroup.keys ? state.customGroup.keys[state.currentKeyIndex] : null,
      lastSelectedDifficulty: state && state.customGroup && state.customGroup.name ? state.customGroup.name : null,
      lastSectionType: this.lastSectionType || this.currentSection || null
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
        this.lastSelectedKey = state.lastSelectedKey || null;
        this.lastSelectedDifficulty = state.lastSelectedDifficulty || null;
        this.lastSectionType = state.lastSectionType || null;
      } catch (e) {
        console.warn('Failed to load menu state:', e);
        this.lastSelectedKey = null;
        this.lastSelectedDifficulty = null;
        this.lastSectionType = null;
      }
    } else {
      this.lastSelectedKey = null;
      this.lastSelectedDifficulty = null;
      this.lastSectionType = null;
    }
  }

  updateMenuDisplay() {
    // Always update key display to Unicode
    this.updateAvailableKeys();
    // Highlight active section link and apply underline
    this.menuLinks.forEach(link => {
      const isActive = link.dataset.section === this.currentSection;
      link.classList.toggle('active', isActive);
      link.classList.toggle('current-selection', isActive);
    });
    // Show only the current options area
    this.optionsAreas.forEach(area => {
      // Always expand the area if currentSection matches
      area.classList.toggle('active', this.currentSection && area.id === `${this.currentSection}-section`);
    });
    // Restore nested selection underline if needed
    if (this.currentSection === 'keys' && this.lastSelectedKey) {
      this.menuOptions.forEach(option => {
        if (option.dataset.key) {
          option.classList.toggle('current-selection', option.dataset.key === this.lastSelectedKey);
        }
      });
    } else if (this.currentSection === 'difficulty' && this.lastSelectedDifficulty) {
      this.menuOptions.forEach(option => {
        if (option.dataset.difficulty) {
          option.classList.toggle('current-selection', option.textContent.trim() === this.lastSelectedDifficulty.trim());
        }
      });
    }
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
      // Map customGroup.name to data-difficulty value
      let selectedDifficulty = null;
      if (state.customGroup && state.customGroup.name) {
        const name = state.customGroup.name.toLowerCase();
        if (name.includes('no accidentals')) selectedDifficulty = 'no-accidentals';
        else if (name.includes('1-3 sharps')) selectedDifficulty = '1-3-sharps';
        else if (name.includes('1-3 flats')) selectedDifficulty = '1-3-flats';
        else if (name.includes('4-6 sharps')) selectedDifficulty = '4-6-sharps';
        else if (name.includes('4-6 flats')) selectedDifficulty = '4-6-flats';
        else if (name.includes('full random')) selectedDifficulty = 'full-random';
        else if (name.includes('sevenths only')) selectedDifficulty = 'spelling-random-sevenths';
        // If it's a key-locked mode, do not select any difficulty
      }
      this.menuOptions.forEach(option => {
        if (option.dataset.difficulty) {
          option.classList.toggle('current-selection', option.dataset.difficulty === selectedDifficulty);
        }
      });
    }
  }

  updateAvailableKeys() {
    // Always show all keys in the keys menu, regardless of current group or difficulty
    const allKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
    
    this.menuOptions.forEach(option => {
      if (option.dataset.key) {
        option.style.display = 'block';
        option.disabled = false;
        // Display keys with proper Unicode symbols and wrap accidentals in a span
        let displayKey = window.accidentalToUnicode(option.dataset.key);
        
        // Wrap accidentals in a span for styling
        displayKey = displayKey.replace(/([♯♭𝄫𝄪]+)/gu, '<span class="accidental">$1</span>');
        
        // Add specific classes for sharp and flat symbols
        displayKey = displayKey.replace(/<span class="accidental">♯<\/span>/gu, '<span class="accidental sharp">♯</span>');
        displayKey = displayKey.replace(/<span class="accidental">♭<\/span>/gu, '<span class="accidental flat">♭</span>');
        
        option.innerHTML = displayKey;
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