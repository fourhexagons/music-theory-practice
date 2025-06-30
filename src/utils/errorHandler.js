/**
 * Music Theory Practice - Error Handling Utilities
 * 
 * Centralized error handling and logging for better debugging and user experience.
 */

// Create a namespace for error handling
window.ErrorHandler = {
  // Error types
  ERROR_TYPES: {
    STATE_ERROR: 'STATE_ERROR',
    DATA_ERROR: 'DATA_ERROR',
    UI_ERROR: 'UI_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR'
  },

  // Error severity levels
  ERROR_SEVERITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  },

  /**
   * Custom error class for application errors
   */
  AppError: class AppError extends Error {
    constructor(message, type, severity = ErrorHandler.ERROR_SEVERITY.MEDIUM, details = {}) {
      super(message);
      this.name = 'AppError';
      this.type = type;
      this.severity = severity;
      this.details = details;
      this.timestamp = new Date().toISOString();
    }
  },

  /**
   * Logs an error with context information
   * @param {Error|AppError} error - The error to log
   * @param {Object} context - Additional context information
   */
  logError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      type: error.type || 'UNKNOWN',
      severity: error.severity || this.ERROR_SEVERITY.MEDIUM,
      stack: error.stack,
      timestamp: error.timestamp || new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };

    console.error('App Error:', errorInfo);

    // In a production environment, you might want to send this to a logging service
    // if (process.env.NODE_ENV === 'production') {
    //   // sendToLoggingService(errorInfo);
    // }
  },

  /**
   * Handles errors gracefully and provides user feedback
   * @param {Error|AppError} error - The error to handle
   * @param {Function} showUserMessage - Function to show user-friendly message
   */
  handleError(error, showUserMessage = null) {
    this.logError(error);

    // Show user-friendly message if provided
    if (showUserMessage && typeof showUserMessage === 'function') {
      const userMessage = this.getUserFriendlyMessage(error);
      showUserMessage(userMessage);
    }

    // For critical errors, you might want to reload the app or redirect
    if (error.severity === this.ERROR_SEVERITY.CRITICAL) {
      console.error('Critical error detected, consider reloading the application');
    }
  },

  /**
   * Converts technical error messages to user-friendly messages
   * @param {Error|AppError} error - The error to convert
   * @returns {string} - User-friendly error message
   */
  getUserFriendlyMessage(error) {
    const messages = {
      [this.ERROR_TYPES.STATE_ERROR]: 'There was an issue with your progress. Please refresh the page.',
      [this.ERROR_TYPES.DATA_ERROR]: 'There was an issue loading the practice data. Please try again.',
      [this.ERROR_TYPES.UI_ERROR]: 'There was an issue with the interface. Please refresh the page.',
      [this.ERROR_TYPES.VALIDATION_ERROR]: 'Please check your answer and try again.',
      [this.ERROR_TYPES.NETWORK_ERROR]: 'There was a connection issue. Please check your internet connection.',
      'UNKNOWN': 'Something went wrong. Please try again.'
    };

    return messages[error.type] || messages['UNKNOWN'];
  },

  /**
   * Wraps a function with error handling
   * @param {Function} fn - The function to wrap
   * @param {string} context - Context for error logging
   * @returns {Function} - Wrapped function with error handling
   */
  withErrorHandling(fn, context = '') {
    return (...args) => {
      try {
        return fn.apply(this, args);
      } catch (error) {
        const appError = new this.AppError(
          error.message,
          this.ERROR_TYPES.UNKNOWN,
          this.ERROR_SEVERITY.MEDIUM,
          { context, args }
        );
        this.handleError(appError);
        throw appError;
      }
    };
  },

  /**
   * Validates required parameters
   * @param {Object} params - Parameters to validate
   * @param {Array} required - Array of required parameter names
   * @throws {AppError} - If required parameters are missing
   */
  validateParams(params, required) {
    const missing = required.filter(param => params[param] === undefined || params[param] === null);
    
    if (missing.length > 0) {
      throw new this.AppError(
        `Missing required parameters: ${missing.join(', ')}`,
        this.ERROR_TYPES.VALIDATION_ERROR,
        this.ERROR_SEVERITY.HIGH,
        { params, required, missing }
      );
    }
  },

  /**
   * Sets up global error handlers
   */
  setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = new this.AppError(
        event.reason?.message || 'Unhandled promise rejection',
        this.ERROR_TYPES.UNKNOWN,
        this.ERROR_SEVERITY.HIGH,
        { reason: event.reason }
      );
      this.handleError(error);
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      const error = new this.AppError(
        event.message,
        this.ERROR_TYPES.UI_ERROR,
        this.ERROR_SEVERITY.MEDIUM,
        { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      );
      this.handleError(error);
    });
  }
};

// Expose handleError globally
window.handleError = window.ErrorHandler.handleError.bind(window.ErrorHandler); 