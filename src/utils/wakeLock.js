/**
 * Wake Lock Utility
 * 
 * Manages the Screen Wake Lock API to prevent the device screen from
 * dimming or locking while the user is actively reading.
 * 
 * Usage:
 *   import { requestWakeLock, releaseWakeLock } from './utils/wakeLock';
 *   await requestWakeLock();  // When reading starts
 *   releaseWakeLock();        // When reading pauses/stops
 */

import logger from './logger';

// Store the wake lock reference
let wakeLock = null;

/**
 * Request a screen wake lock to prevent display from sleeping
 * Gracefully handles browsers that don't support the Wake Lock API
 * 
 * @returns {Promise<boolean>} True if wake lock acquired, false otherwise
 */
export const requestWakeLock = async () => {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            logger.log('WakeLock acquired.');

            // Re-acquire wake lock if visibility changes
            wakeLock.addEventListener('release', () => {
                logger.log('WakeLock was released.');
            });

            return true;
        } else {
            logger.warn('Wake Lock API not supported in this browser.');
            return false;
        }
    } catch (err) {
        logger.warn('WakeLock failed:', err.message);
        return false;
    }
};

/**
 * Release the active screen wake lock
 * Safe to call even if no wake lock is active
 */
export const releaseWakeLock = () => {
    if (wakeLock !== null) {
        wakeLock.release()
            .then(() => {
                wakeLock = null;
                logger.log('WakeLock released.');
            })
            .catch((err) => {
                logger.warn('Error releasing WakeLock:', err.message);
            });
    }
};

/**
 * Check if a wake lock is currently active
 * @returns {boolean} True if wake lock is active
 */
export const isWakeLockActive = () => {
    return wakeLock !== null;
};

export default {
    requestWakeLock,
    releaseWakeLock,
    isWakeLockActive,
};
