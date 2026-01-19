/**
 * Tokenizer Utility
 * 
 * Processes raw text input and converts it into an array of clean tokens (words).
 * Handles control characters, whitespace normalization, and filtering.
 * 
 * Usage:
 *   import { cleanAndTokenize } from './utils/tokenizer';
 *   const words = cleanAndTokenize(rawText);
 */

import logger from './logger';

/**
 * Clean raw text and split into individual word tokens
 * 
 * Steps:
 * 1. Remove non-printable control characters (0x00-0x1F, 0x7F-0x9F)
 * 2. Trim whitespace from start and end
 * 3. Split on any whitespace (spaces, tabs, newlines)
 * 4. Filter out empty strings
 * 
 * @param {string} raw - Raw input text to tokenize
 * @returns {string[]} Array of cleaned word tokens
 */
export const cleanAndTokenize = (raw) => {
    if (!raw) return [];

    logger.group('Tokenization Debug', () => {
        logger.log('Original Text length:', raw.length);
    });

    // Step 1: Remove non-printable control characters
    let text = raw.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

    // Step 2 & 3: Trim and split by whitespace
    const tokens = text.trim().split(/\s+/);

    // Step 4: Filter empty strings
    const filtered = tokens.filter(t => t.length > 0);

    logger.group('Tokenization Result', () => {
        logger.log('Tokens generated:', filtered.length);
        logger.log('Sample tokens:', filtered.slice(0, 20));
    });

    return filtered;
};

/**
 * Calculate the optimal reading interval based on WPM
 * @param {number} wpm - Words per minute
 * @returns {number} Interval in milliseconds between words
 */
export const calculateInterval = (wpm) => {
    return 60000 / wpm;
};

/**
 * Calculate the pivot index for a word (the letter to highlight)
 * Based on word length for optimal reading position
 * 
 * @param {string} word - The word to find pivot for
 * @returns {number} Index of the pivot character
 */
export const getPivotIndex = (word) => {
    const length = word.length;
    if (length === 1) return 0;
    if (length <= 5) return 1;
    if (length <= 9) return 2;
    if (length <= 13) return 3;
    return 4;
};

export default {
    cleanAndTokenize,
    calculateInterval,
    getPivotIndex,
};
