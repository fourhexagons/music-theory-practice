// Accessibility utilities
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
    // Ensure focus is visible
    document.addEventListener('focusin', (e) => {
      if (e.target.matches('input, button, select, textarea, [tabindex]')) {
        e.target.style.outline = '2px solid #007acc';
        e.target.style.outlineOffset = '2px';
      }
    });
    document.addEventListener('focusout', (e) => {
      if (e.target.matches('input, button, select, textarea, [tabindex]')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
      }
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