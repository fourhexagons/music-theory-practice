/**
 * Centralized Logging Utility
 * Provides environment-based logging with configurable levels
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1, 
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

class Logger {
  constructor() {
    // Determine environment and logging level
    this.isDev = import.meta.env?.DEV ?? (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
    this.isTest = window.location.search.includes('test=true');
    
    // Set default log level based on environment
    if (this.isTest) {
      this.logLevel = LOG_LEVELS.DEBUG; // Show detailed logs during testing
    } else if (this.isDev) {
      this.logLevel = LOG_LEVELS.INFO;  // Show info logs in development
    } else {
      this.logLevel = LOG_LEVELS.WARN;  // Production: only warnings and errors
    }
    
    // Allow override via URL parameter
    const urlLevel = new URLSearchParams(window.location.search).get('logLevel');
    if (urlLevel && LOG_LEVELS[urlLevel.toUpperCase()] !== undefined) {
      this.logLevel = LOG_LEVELS[urlLevel.toUpperCase()];
    }
  }

  error(message, ...args) {
    if (this.logLevel >= LOG_LEVELS.ERROR) {
      console.error(`❌ ${message}`, ...args);
    }
  }

  warn(message, ...args) {
    if (this.logLevel >= LOG_LEVELS.WARN) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  }

  info(message, ...args) {
    if (this.logLevel >= LOG_LEVELS.INFO) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  }

  debug(message, ...args) {
    if (this.logLevel >= LOG_LEVELS.DEBUG) {
      console.log(`🔍 ${message}`, ...args);
    }
  }

  trace(message, ...args) {
    if (this.logLevel >= LOG_LEVELS.TRACE) {
      console.log(`🔬 ${message}`, ...args);
    }
  }

  // Special methods for common use cases
  performance(metric, value) {
    if (this.logLevel >= LOG_LEVELS.DEBUG) {
      console.log(`📊 Performance: ${metric} = ${value.toFixed(2)}ms`);
    }
  }

  appState(message, data) {
    if (this.logLevel >= LOG_LEVELS.INFO) {
      console.log(`🎵 ${message}`, data);
    }
  }

  validation(message, data) {
    if (this.logLevel >= LOG_LEVELS.TRACE) {
      console.log(`✅ Validation: ${message}`, data);
    }
  }

  // Production-safe logging that always shows
  userError(message, error) {
    console.error(`🚨 User Error: ${message}`, error);
  }

  // System status that should always be visible
  system(message, ...args) {
    console.log(`🔧 ${message}`, ...args);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export log levels for external configuration
export { LOG_LEVELS }; 