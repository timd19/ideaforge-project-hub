// Logger utility for consistent logging and debugging

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

// Configuration for the logger
interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  consoleOutput: boolean;
  storeLogs: boolean;
  maxStoredLogs: number;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  enabled: true,
  level: LogLevel.INFO,
  consoleOutput: true,
  storeLogs: true,
  maxStoredLogs: 100
};

// In-memory log storage
const logStorage: Array<{
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}> = [];

// Current configuration
let currentConfig: LoggerConfig = { ...defaultConfig };

// Initialize logger with custom configuration
export const initLogger = (config: Partial<LoggerConfig> = {}): void => {
  currentConfig = { ...defaultConfig, ...config };
  log(LogLevel.INFO, 'Logger initialized', { config: currentConfig });
};

// Main logging function
export const log = (level: LogLevel, message: string, data?: any): void => {
  if (!currentConfig.enabled) return;
  if (getLevelValue(level) < getLevelValue(currentConfig.level)) return;

  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, message, data };

  // Console output
  if (currentConfig.consoleOutput) {
    const consoleMethod = getConsoleMethod(level);
    if (data) {
      console[consoleMethod](`[${timestamp}] [${level}] ${message}`, data);
    } else {
      console[consoleMethod](`[${timestamp}] [${level}] ${message}`);
    }
  }

  // Store logs in memory
  if (currentConfig.storeLogs) {
    logStorage.push(logEntry);
    // Trim log storage if it exceeds the maximum size
    if (logStorage.length > currentConfig.maxStoredLogs) {
      logStorage.shift();
    }
  }
};

// Helper functions for different log levels
export const debug = (message: string, data?: any): void => log(LogLevel.DEBUG, message, data);
export const info = (message: string, data?: any): void => log(LogLevel.INFO, message, data);
export const warn = (message: string, data?: any): void => log(LogLevel.WARN, message, data);
export const error = (message: string, data?: any): void => log(LogLevel.ERROR, message, data);
export const fatal = (message: string, data?: any): void => log(LogLevel.FATAL, message, data);

// Get all stored logs
export const getLogs = (): Array<any> => [...logStorage];

// Clear all stored logs
export const clearLogs = (): void => {
  logStorage.length = 0;
  debug('Logs cleared');
};

// Export logs as JSON string
export const exportLogs = (): string => {
  return JSON.stringify(logStorage, null, 2);
};

// Helper to get numeric value for log level (for comparison)
const getLevelValue = (level: LogLevel): number => {
  switch (level) {
    case LogLevel.DEBUG: return 0;
    case LogLevel.INFO: return 1;
    case LogLevel.WARN: return 2;
    case LogLevel.ERROR: return 3;
    case LogLevel.FATAL: return 4;
    default: return 1;
  }
};

// Map log level to console method
const getConsoleMethod = (level: LogLevel): 'debug' | 'info' | 'warn' | 'error' => {
  switch (level) {
    case LogLevel.DEBUG: return 'debug';
    case LogLevel.INFO: return 'info';
    case LogLevel.WARN: return 'warn';
    case LogLevel.ERROR: 
    case LogLevel.FATAL: 
      return 'error';
    default: return 'info';
  }
};

// Initialize logger with default settings
initLogger();

