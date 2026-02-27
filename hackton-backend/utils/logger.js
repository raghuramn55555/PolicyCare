/**
 * Structured Logger Utility
 * Provides timestamped, leveled logging to replace raw console.log calls.
 */

const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const CURRENT_LEVEL = LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LEVELS.INFO;

function timestamp() {
    return new Date().toISOString();
}

function format(level, tag, message) {
    const tagStr = tag ? `[${tag}] ` : '';
    return `${timestamp()} ${level} ${tagStr}${message}`;
}

const logger = {
    debug(message, tag = '') {
        if (CURRENT_LEVEL <= LEVELS.DEBUG) console.debug(format('DEBUG', tag, message));
    },
    info(message, tag = '') {
        if (CURRENT_LEVEL <= LEVELS.INFO) console.log(format('INFO ', tag, message));
    },
    warn(message, tag = '') {
        if (CURRENT_LEVEL <= LEVELS.WARN) console.warn(format('WARN ', tag, message));
    },
    error(message, tag = '') {
        if (CURRENT_LEVEL <= LEVELS.ERROR) console.error(format('ERROR', tag, message));
    },
};

export default logger;
