/**
 * ControlPanel Component
 * 
 * Contains the WPM speed slider and playback control buttons.
 * Provides play/pause, back 10 words, and full restart functionality.
 * 
 * Props:
 *   - wpm: Current words per minute setting
 *   - isPlaying: Whether playback is active
 *   - onWpmChange: Callback when WPM slider changes
 *   - onPlayPause: Callback to toggle play/pause
 *   - onBack10: Callback to go back 10 words
 *   - onRestart: Callback to restart from beginning
 */

import React from 'react';
import '../styles/components/ControlPanel.css';

const ControlPanel = ({
    wpm,
    isPlaying,
    onWpmChange,
    onPlayPause,
    onBack10,
    onRestart
}) => {
    return (
        <>
            {/* WPM Slider Section */}
            <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-500 mb-4 font-mono uppercase tracking-wider">
                    <span>Speed</span>
                    <span className="text-[var(--primary)] font-bold">{wpm} WPM</span>
                </div>
                <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={wpm}
                    onChange={(e) => onWpmChange(Number(e.target.value))}
                    className="w-full wpm-slider"
                />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-8 mb-8">
                {/* Back 10 Words Button */}
                <button
                    onClick={onBack10}
                    className="text-gray-500 hover:text-[var(--text-main)] transition transform hover:-rotate-12 active:scale-90"
                    title="Back 10 words"
                >
                    <i className="fas fa-backward text-xl"></i>
                </button>

                {/* Play/Pause Button */}
                <button
                    onClick={onPlayPause}
                    className="w-20 h-20 rounded-full bg-[var(--primary)] hover:opacity-80 text-[var(--bg-dark)] flex items-center justify-center transition-all duration-300 shadow-xl active:scale-95"
                >
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play pl-1'} text-2xl`}></i>
                </button>

                {/* Full Restart Button */}
                <button
                    onClick={onRestart}
                    className="text-gray-500 hover:text-[var(--text-main)] transition transform hover:rotate-12 active:scale-90"
                    title="Full Restart"
                >
                    <i className="fas fa-undo text-xl"></i>
                </button>
            </div>
        </>
    );
};

export default ControlPanel;
