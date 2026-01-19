/**
 * RSVPDisplay Component
 * 
 * The core display area showing words in RSVP (Rapid Serial Visual Presentation) format.
 * Splits each word into left, pivot (highlighted), and right sections for
 * optimal focus during speed reading.
 * 
 * Props:
 *   - word: Current word to display
 *   - currentIndex: Current position in word array
 *   - totalWords: Total number of words
 *   - isFinished: Whether reading is complete
 */

import React, { useMemo } from 'react';
import { getPivotIndex } from '../utils/tokenizer';
import logger from '../utils/logger';
import '../styles/components/RSVPDisplay.css';

const RSVPDisplay = ({ word, currentIndex, totalWords, isFinished }) => {
    /**
     * Split the word into left, pivot, and right sections
     * Memoized for performance during rapid updates
     */
    const { left, pivot, right } = useMemo(() => {
        if (!word) {
            return { left: '', pivot: '', right: '' };
        }

        const pivotIdx = getPivotIndex(word);

        logger.logRender(currentIndex, word);

        return {
            left: word.substring(0, pivotIdx),
            pivot: word.substring(pivotIdx, pivotIdx + 1),
            right: word.substring(pivotIdx + 1),
        };
    }, [word, currentIndex]);

    /**
     * Calculate progress percentage
     */
    const progressPercent = totalWords > 0
        ? ((currentIndex + 1) / totalWords) * 100
        : 0;

    return (
        <div className="mb-10 relative h-64 flex flex-col justify-center items-center">
            {/* Word Display Area */}
            <div className="rsvp-display w-full">
                <div className="word-container">
                    {/* Left part of word (before pivot) */}
                    <span className="word-left">{left}</span>

                    {/* Pivot wrapper with markers */}
                    <div className="pivot-wrapper">
                        <div className="pivot-marker marker-top"></div>
                        <span className="word-pivot">{pivot}</span>
                        <div className="pivot-marker marker-bottom"></div>
                    </div>

                    {/* Right part of word (after pivot) */}
                    <span className="word-right">{right}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-8 w-32 h-1 bg-neutral-500/10 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-[var(--primary)] transition-[width] duration-300 ease-out ${(isFinished || currentIndex >= totalWords - 1) ? 'progress-finished' : ''}`}
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            {/* Progress Counter */}
            <div className="absolute bottom-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                {currentIndex + 1} / {totalWords}
            </div>
        </div>
    );
};

export default RSVPDisplay;
