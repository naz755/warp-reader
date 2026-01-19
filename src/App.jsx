/**
 * Main Application Component
 * 
 * The root component that orchestrates all parts of the Warp Speed Reader.
 * Manages global state through the useReader hook and passes data/callbacks
 * to child components.
 */

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import RSVPDisplay from './components/RSVPDisplay';
import ControlPanel from './components/ControlPanel';
import TextInput from './components/TextInput';
import Ambience from './components/Ambience';
import { useReader } from './hooks/useReader';
import { processFile } from './utils/fileProcessor';
import logger from './utils/logger';
import './styles/global.css';

function App() {
    // Initialize the reader hook with all state and controls
    const {
        words,
        currentIndex,
        isPlaying,
        isReady,
        isFinished,
        wpm,
        theme,
        fileName,
        setWpm,
        setTheme,
        togglePlayPause,
        restart,
        back10,
        loadText,
        clearText,
        setLoadedFileName,
        markTextModified,
    } = useReader();

    // Local state for textarea content
    const [textContent, setTextContent] = useState('');

    /**
     * Apply theme to document body
     */
    useEffect(() => {
        logger.log('Changing theme to', theme);
        document.body.removeAttribute('data-theme');
        if (theme !== 'default') {
            document.body.setAttribute('data-theme', theme);
        }
    }, [theme]);

    /**
     * Log initialization message on mount
     */
    useEffect(() => {
        logger.log('System Initialized. Version 1.0.8-react');
    }, []);

    /**
     * Handle keyboard shortcuts
     */
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Spacebar toggles play/pause when not in textarea
            if (e.code === 'Space' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                togglePlayPause();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [togglePlayPause]);

    /**
     * Handle text area content changes
     */
    const handleTextChange = useCallback((text) => {
        setTextContent(text);
        markTextModified();
    }, [markTextModified]);

    /**
     * Handle file selection and processing
     */
    const handleFileSelect = useCallback(async (file) => {
        try {
            const text = await processFile(file);
            setTextContent(text);
            setLoadedFileName(file.name);
            loadText(text);
        } catch (error) {
            logger.error('File processing failed:', error.message);
        }
    }, [loadText, setLoadedFileName]);

    /**
     * Handle load text button click
     */
    const handleLoadText = useCallback((text) => {
        loadText(text);
    }, [loadText]);

    /**
     * Handle clear button click
     */
    const handleClear = useCallback(() => {
        setTextContent('');
        clearText();
    }, [clearText]);

    // Get current word to display
    const currentWord = words[currentIndex] || '';

    return (
        <div className="min-h-screen flex flex-col selection:bg-neutral-500 selection:text-white">
            {/* Background Ambience */}
            <Ambience theme={theme} />

            {/* Main Content Container */}
            <div className="container mx-auto px-6 py-8 max-w-2xl flex-grow flex flex-col relative z-10">
                {/* Header with Logo and Theme Switcher */}
                <Header theme={theme} onThemeChange={setTheme} />

                {/* RSVP Word Display */}
                <RSVPDisplay
                    word={currentWord}
                    currentIndex={currentIndex}
                    totalWords={words.length}
                    isFinished={isFinished}
                />

                {/* Control Panel with WPM and Playback */}
                <div className="panel rounded-[2rem] p-8 backdrop-blur-xl">
                    <ControlPanel
                        wpm={wpm}
                        isPlaying={isPlaying}
                        onWpmChange={setWpm}
                        onPlayPause={togglePlayPause}
                        onBack10={back10}
                        onRestart={restart}
                    />

                    {/* Text Input Area */}
                    <TextInput
                        text={textContent}
                        isReady={isReady}
                        theme={theme}
                        fileName={fileName}
                        onTextChange={handleTextChange}
                        onLoadText={handleLoadText}
                        onFileSelect={handleFileSelect}
                        onClear={handleClear}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
