// Practice Menu Overlay Component
// Handles the practice menu overlay functionality with Ableton-inspired design

class PracticeMenu {
  constructor() {
    this.isOpen = false;
    this.currentSection = 'keys';
    this.menuButton = document.getElementById('practice-menu-button');
    this.overlay = document.getElementById('practice-menu-overlay');
    this.menuLinks = document.querySelectorAll('.practice-menu-link');
    this.menuSections = document.querySelectorAll('.practice-menu-section');
    this.menuOptions = document.querySelectorAll('.practice-menu-option');
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadMenuState();
    this.updateMenuDisplay();
  }

  bindEvents() {
    // Menu button toggle
    this.menuButton.addEventListener('click', () => this.toggleMenu());
    
    // Menu navigation
    this.menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const section = e.target.dataset.section;
        this.switchSection(section);
      });
    });

    // Menu options
    this.menuOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        this.handleMenuOption(e.target);
      });
    });

    // Close menu when clicking on menu bar (left section)
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay || e.target.closest('.practice-menu-bar')) {
        this.closeMenu();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
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
    document.body.classList.add('practice-menu-open');
    this.overlay.classList.add('open');
    this.saveMenuState();
    this.updateMenuDisplay();
  }

  closeMenu() {
    this.isOpen = false;
    document.body.classList.remove('practice-menu-open');
    this.overlay.classList.remove('open');
    this.saveMenuState();
    this.updateMenuDisplay();
  }

  switchSection(section) {
    this.currentSection = section;
    
    // Update active states
    this.menuLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === section);
    });
    
    this.menuSections.forEach(sectionEl => {
      sectionEl.classList.toggle('active', sectionEl.id === `${section}-section`);
    });
    
    this.saveMenuState();
  }

  handleMenuOption(option) {
    const key = option.dataset.key;
    const difficulty = option.dataset.difficulty;
    
    if (key) {
      this.selectKey(key);
    } else if (difficulty) {
      this.selectDifficulty(difficulty);
    }
    
    this.closeMenu();
  }

  selectKey(key) {
    console.log('Selected key:', key);
    // TODO: Implement key selection logic
    // This will integrate with the existing app logic
    this.setPracticeMode('single-key', { key });
  }

  selectDifficulty(difficulty) {
    console.log('Selected difficulty:', difficulty);
    
    switch (difficulty) {
      case 'start-over':
        this.resetToBeginning();
        break;
      case 'C':
        this.setPracticeMode('single-key', { key: 'C' });
        break;
      case 'G-D-A':
        this.setPracticeMode('key-group', { keys: ['G', 'D', 'A'] });
        break;
      case 'F-Bb-Eb':
        this.setPracticeMode('key-group', { keys: ['F', 'Bb', 'Eb'] });
        break;
      case 'E-B-F#':
        this.setPracticeMode('key-group', { keys: ['E', 'B', 'F#'] });
        break;
      case 'Ab-Db-Gb':
        this.setPracticeMode('key-group', { keys: ['Ab', 'Db', 'Gb'] });
        break;
      case 'full-random':
        this.setPracticeMode('full-random');
        break;
      case 'spelling-random-sevenths':
        this.setPracticeMode('sevenths-spelling');
        break;
      default:
        console.warn('Unknown difficulty:', difficulty);
    }
  }

  setPracticeMode(mode, options = {}) {
    // Store the practice mode in localStorage for persistence
    const practiceConfig = {
      mode,
      options,
      timestamp: Date.now()
    };
    
    localStorage.setItem('practiceMode', JSON.stringify(practiceConfig));
    
    // TODO: Integrate with existing app logic
    // This will need to communicate with the main app to change the practice mode
    console.log('Practice mode set:', practiceConfig);
    
    // For now, just reload the page to apply changes
    // In the future, this should update the app state without reloading
    window.location.reload();
  }

  resetToBeginning() {
    // Clear any stored practice mode and reset to beginning
    localStorage.removeItem('practiceMode');
    localStorage.removeItem('learningState');
    
    // TODO: Reset the app to the beginning of the learning path
    console.log('Reset to beginning');
    window.location.reload();
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
        this.currentSection = state.currentSection || 'keys';
      } catch (e) {
        console.warn('Failed to load menu state:', e);
      }
    }
  }

  updateMenuDisplay() {
    // Update button state
    this.menuButton.classList.toggle('active', this.isOpen);
    
    // Update section visibility
    this.menuSections.forEach(section => {
      section.classList.toggle('active', section.id === `${this.currentSection}-section`);
    });
    
    // Update link active states
    this.menuLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === this.currentSection);
    });
  }
}

// Initialize the practice menu when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on the practice page
  if (window.location.pathname === '/practice' || window.location.pathname === '/practice.html') {
    window.practiceMenu = new PracticeMenu();
  }
}); 