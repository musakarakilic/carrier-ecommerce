/**
 * Centralized logging utility
 * Provides consistent logging across the application
 * Can be configured to send logs to a service in production
 */

// Environment check
const isDev = import.meta.env.DEV;

// Log levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

/**
 * Log message with context
 * @param {string} level - Log level (error, warn, info, debug)
 * @param {string} message - Main log message
 * @param {Object} data - Additional data to log
 * @param {string} context - Context of the log (component/service name)
 */
export const log = (level, message, data = null, context = '') => {
  if (!isDev) {
    // In production, we might want to send logs to a service
    // or only log errors, etc.
    if (level === LOG_LEVELS.ERROR) {
      // Always log errors, even in production
      console.error(`[${context}] ${message}`, data || '');
      
      // Here you could send error logs to a service
      // Example: sendErrorToService(message, data, context);
    }
    return;
  }
  
  // Format context
  const contextPrefix = context ? `[${context}] ` : '';
  
  // In development, log everything to console
  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error(`${contextPrefix}${message}`, data || '');
      break;
    case LOG_LEVELS.WARN:
      console.warn(`${contextPrefix}${message}`, data || '');
      break;
    case LOG_LEVELS.INFO:
      console.info(`${contextPrefix}${message}`, data || '');
      break;
    case LOG_LEVELS.DEBUG:
      console.debug(`${contextPrefix}${message}`, data || '');
      break;
    default:
      console.log(`${contextPrefix}${message}`, data || '');
  }
};

// Convenience methods for different log levels
export const logError = (message, data = null, context = '') => 
  log(LOG_LEVELS.ERROR, message, data, context);

export const logWarn = (message, data = null, context = '') => 
  log(LOG_LEVELS.WARN, message, data, context);

export const logInfo = (message, data = null, context = '') => 
  log(LOG_LEVELS.INFO, message, data, context);

export const logDebug = (message, data = null, context = '') => 
  log(LOG_LEVELS.DEBUG, message, data, context);

export default {
  log,
  logError,
  logWarn,
  logInfo,
  logDebug,
  LOG_LEVELS
}; 