const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor(minLevel = 'INFO') {
    this.minLevel = LOG_LEVELS[minLevel] || LOG_LEVELS.INFO;
  }

  debug(...args) {
    if (this.minLevel <= LOG_LEVELS.DEBUG) {
      console.debug(new Date().toISOString(), '[DEBUG]', ...args);
    }
  }

  info(...args) {
    if (this.minLevel <= LOG_LEVELS.INFO) {
      console.info(new Date().toISOString(), '[INFO]', ...args);
    }
  }

  warn(...args) {
    if (this.minLevel <= LOG_LEVELS.WARN) {
      console.warn(new Date().toISOString(), '[WARN]', ...args);
    }
  }

  error(...args) {
    if (this.minLevel <= LOG_LEVELS.ERROR) {
      console.error(new Date().toISOString(), '[ERROR]', ...args);
    }
  }
}

export const logger = new Logger(process.env.NODE_ENV === 'development' ? 'DEBUG' : 'INFO'); 