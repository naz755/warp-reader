/**
 * Logger Utility
 * 
 * Provides a centralized logging system for the Warp Reader application.
 * All logs are prefixed with "WARP:" for easy identification in console.
 * 
 * Usage:
 *   import logger from './utils/logger';
 *   logger.log("Message here");
 *   logger.group("Debug Group", () => { ... });
 */

const PREFIX = 'WARP:';

/**
 * Standard log message with WARP prefix
 * @param  {...any} args - Arguments to log
 */
export const log = (...args) => {
    console.log(PREFIX, ...args);
};

/**
 * Warning message with WARP prefix
 * @param  {...any} args - Arguments to log
 */
export const warn = (...args) => {
    console.warn(PREFIX, ...args);
};

/**
 * Error message with WARP prefix
 * @param  {...any} args - Arguments to log
 */
export const error = (...args) => {
    console.error(PREFIX, ...args);
};

/**
 * Create a grouped log section
 * @param {string} label - Group label
 * @param {Function} callback - Function containing grouped logs
 */
export const group = (label, callback) => {
    console.group(`${PREFIX} ${label}`);
    callback();
    console.groupEnd();
};

/**
 * Log render operation for a word at specific index
 * @param {number} index - Current word index
 * @param {string} word - The word being rendered
 */
export const logRender = (index, word) => {
    console.log(`${PREFIX} Rendering Word [${index}] -> "${word}"`);
};

export default {
    log,
    warn,
    error,
    group,
    logRender,
};
