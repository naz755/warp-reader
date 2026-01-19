/**
 * useReader Hook
 * 
 * Custom React hook that manages all state and logic for the RSVP speed reader.
 * Encapsulates word display, playback controls, WPM settings, and theme management.
 * 
 * Usage:
 *   const { words, currentIndex, isPlaying, play, pause, ... } = useReader();
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { cleanAndTokenize, calculateInterval } from '../utils/tokenizer';
import { requestWakeLock, releaseWakeLock } from '../utils/wakeLock';
import logger from '../utils/logger';

// Default welcome words shown on initial load
const DEFAULT_WORDS = ['welcome', 'to', 'warp.', 'velocity', 'reading', 'system.', 'ready?'];

/**
 * Main reader hook providing all state and controls for the speed reader
 * 
 * @returns {Object} Reader state and control functions
 */
export const useReader = () => {
    // Core reading state
    const [words, setWords] = useState(DEFAULT_WORDS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Settings
    const [wpm, setWpm] = useState(300);
    const [theme, setTheme] = useState('default');

    // File state
    const [fileName, setFileName] = useState('');

    // Timeout reference for cleanup
    const timeoutRef = useRef(null);

    /**
     * Start playback of the word sequence
     */
    const play = useCallback(async () => {
        logger.log('Start requested.');

        // If at the end, restart from beginning
        if (currentIndex >= words.length - 1) {
            setCurrentIndex(0);
            setIsFinished(false);
        }

        setIsPlaying(true);
        await requestWakeLock();
    }, [currentIndex, words.length]);

    /**
     * Pause playback
     */
    const pause = useCallback(() => {
        logger.log('Pause requested.');
        setIsPlaying(false);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        releaseWakeLock();
    }, []);

    /**
     * Toggle between play and pause
     */
    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    /**
     * Full restart - go back to first word
     */
    const restart = useCallback(() => {
        logger.log('Resetting to word index 0.');
        setCurrentIndex(0);
        setIsFinished(false);
        pause();
    }, [pause]);

    /**
     * Go back 10 words
     */
    const back10 = useCallback(() => {
        const newIndex = Math.max(0, currentIndex - 10);
        logger.log('Jumped back to index', newIndex);
        setCurrentIndex(newIndex);
        setIsFinished(false);
        pause();
    }, [currentIndex, pause]);

    /**
     * Load text and tokenize it into words
     * @param {string} text - Raw text to load
     */
    const loadText = useCallback((text) => {
        logger.log('Loading text from input...');
        const tokenized = cleanAndTokenize(text);

        if (tokenized.length === 0) {
            setWords(['ready', 'to', 'warp']);
        } else {
            setWords(tokenized);
        }

        setCurrentIndex(0);
        setIsFinished(false);
        setIsReady(true);
        pause();
    }, [pause]);

    /**
     * Clear all text and reset state
     */
    const clearText = useCallback(() => {
        logger.log('Clearing file/text input.');
        setWords(DEFAULT_WORDS);
        setCurrentIndex(0);
        setIsReady(false);
        setIsFinished(false);
        setFileName('');
        pause();
    }, [pause]);

    /**
     * Set the loaded file name for display
     * @param {string} name - File name to display
     */
    const setLoadedFileName = useCallback((name) => {
        setFileName(name.toLowerCase());
    }, []);

    /**
     * Mark text input as modified (not ready)
     */
    const markTextModified = useCallback(() => {
        setIsReady(false);
    }, []);

    // Playback loop effect
    useEffect(() => {
        if (!isPlaying) return;

        const runLoop = () => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;

                if (nextIndex >= words.length) {
                    logger.log('Sequence finished.');
                    setIsPlaying(false);
                    setIsFinished(true);
                    releaseWakeLock();
                    return words.length - 1;
                }

                return nextIndex;
            });
        };

        timeoutRef.current = setTimeout(runLoop, calculateInterval(wpm));

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isPlaying, currentIndex, wpm, words.length]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            releaseWakeLock();
        };
    }, []);

    return {
        // State
        words,
        currentIndex,
        isPlaying,
        isReady,
        isFinished,
        wpm,
        theme,
        fileName,

        // Setters
        setWpm,
        setTheme,

        // Controls
        play,
        pause,
        togglePlayPause,
        restart,
        back10,
        loadText,
        clearText,
        setLoadedFileName,
        markTextModified,
    };
};

export default useReader;
