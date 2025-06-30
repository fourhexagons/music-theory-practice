// Global error handling system
export class GlobalErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
    this.createUserFeedbackSystem();
  }
  setupGlobalHandlers() {
    // Catch JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'JavaScript Error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Promise Rejection');
      event.preventDefault(); // Prevent console spam
    });
  }
  handleError(error, type, context = {}) {
    const errorInfo = {
      type,
      message: error?.message || String(error),
      stack: error?.stack || 'No stack trace available',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context
    };
    // Log for debugging (keep this for development)
    console.error('Global Error Caught:', errorInfo);
    // Show user-friendly message
    this.showUserError(this.getUserFriendlyMessage(error));
    // Optional: Report to error tracking service
    // this.reportError(errorInfo);
  }
  getUserFriendlyMessage(error) {
    const message = error?.message?.toLowerCase() || '';
    if (message.includes('network') || message.includes('fetch')) {
      return 'Connection issue. Please check your internet connection and try again.';
    }
    if (message.includes('permission') || message.includes('denied')) {
      return 'Permission required. Please check your browser settings.';
    }
    if (message.includes('storage') || message.includes('quota')) {
      return 'Storage issue. Please clear some browser data and try again.';
    }
    // Generic fallback
    return 'Something went wrong. Please refresh the page and try again.';
  }
  createUserFeedbackSystem() {
    // Create feedback container
    const container = document.createElement('div');
    container.id = 'error-feedback-container';
    container.className = 'error-feedback-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
    `;
    document.body.appendChild(container);
    this.feedbackContainer = container;
  }
  showUserError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.style.cssText = `
      background: #f44336;
      color: white;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      float: right;
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: 10px;
    `;
    closeBtn.onclick = () => errorDiv.remove();
    errorDiv.insertBefore(closeBtn, errorDiv.firstChild);
    this.feedbackContainer.appendChild(errorDiv);
    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 8000);
    // Announce to screen readers
    if (window.accessibilityManager) {
      window.accessibilityManager.announce(message);
    }
  }
}
// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
// Initialize error handling
document.addEventListener('DOMContentLoaded', () => {
  window.globalErrorHandler = new GlobalErrorHandler();
});
// Make available globally
window.GlobalErrorHandler = GlobalErrorHandler; 