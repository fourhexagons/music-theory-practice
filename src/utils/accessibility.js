// Accessibility utilities - FIXED to remove blue outline override
export class AccessibilityManager {
  constructor() {
    this.setupKeyboardNavigation();
    this.createScreenReaderAnnouncer();
    this.setupFocusManagement();
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape key handling
      if (e.key === 'Escape') {
        this.handleEscapeKey(e);
      }
      // Enter key on buttons
      if (e.key === 'Enter' && e.target.matches('button, [role="button"]')) {
        e.target.click();
      }
    });
  }

  createScreenReaderAnnouncer() {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      border: 0 !important;
    `;
    document.body.appendChild(announcer);
    this.announcer = announcer;
  }

  announce(message) {
    if (this.announcer) {
      this.announcer.textContent = message;
      setTimeout(() => {
        this.announcer.textContent = '';
      }, 1000);
    }
  }

  setupFocusManagement() {
    // REMOVED: Blue outline override - CSS now handles focus styles
    // Keep focus visible for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  handleEscapeKey(e) {
    // Close any open modals or menus
    const openMenu = document.querySelector('.practice-menu-overlay.open');
    if (openMenu) {
      openMenu.classList.remove('open');
      document.body.classList.remove('practice-menu-open');
    }
  }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  window.accessibilityManager = new AccessibilityManager();
});

// Make available globally
window.AccessibilityManager = AccessibilityManager; 