/**
 * TextInput Component
 * 
 * Provides the text input area, paste button, file upload, and initialization.
 * Handles file selection for PDF, DOCX, and TXT formats.
 * 
 * Props:
 *   - text: Current text in the textarea
 *   - isReady: Whether text has been initialized
 *   - theme: Current theme for button styling
 *   - fileName: Name of loaded file (if any)
 *   - onTextChange: Callback when textarea content changes
 *   - onLoadText: Callback to initialize/load the text
 *   - onFileSelect: Callback when a file is selected
 *   - onClear: Callback to clear all input
 */

import React, { useRef } from 'react';
import logger from '../utils/logger';
import '../styles/components/TextInput.css';

const TextInput = ({
    text,
    isReady,
    theme,
    fileName,
    onTextChange,
    onLoadText,
    onFileSelect,
    onClear,
}) => {
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    /**
     * Handle paste from clipboard
     */
    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText) {
                logger.log('Clipboard text pasted.');
                onTextChange(clipboardText);
            }
        } catch (err) {
            // Fallback: focus the textarea so user can Ctrl+V
            textareaRef.current?.focus();
        }
    };

    /**
     * Handle file input change
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    /**
     * Get the appropriate class for the init button based on state and theme
     */
    const getInitButtonClass = () => {
        const baseClass = 'util-btn flex-grow border border-white/5 text-xs font-bold uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2';

        if (isReady) {
            switch (theme) {
                case 'default':
                    return `${baseClass} btn-ready-default`;
                case 'cyber':
                    return `${baseClass} btn-ready-cyber`;
                case 'mono':
                    return `${baseClass} btn-ready-mono`;
                default:
                    return `${baseClass} btn-ready-default`;
            }
        }

        return `${baseClass} text-gray-400 bg-[var(--btn-inactive)] hover:bg-[var(--primary)] hover:text-[var(--bg-dark)] hover:border-[var(--primary)]`;
    };

    return (
        <div className="border-t border-black/5 pt-6">
            {/* Textarea with Paste Button */}
            <div className="relative w-full mb-4 group">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    className="w-full h-32 bg-black/5 border border-black/5 rounded-xl p-4 text-xs focus:border-[var(--primary)] focus:ring-0 outline-none resize-none transition placeholder-gray-500 leading-relaxed custom-scrollbar"
                    placeholder="paste text here..."
                />
                <button
                    onClick={handlePaste}
                    className="util-btn absolute top-3 right-3 bg-black/10 hover:bg-[var(--primary)] hover:text-[var(--bg-dark)] text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg transition text-gray-500 flex items-center gap-2 z-20"
                >
                    <i className="fas fa-paste"></i> Paste
                </button>
            </div>

            {/* Initialize and Upload Buttons */}
            <div className="flex gap-3 h-12">
                <button
                    onClick={() => onLoadText(text)}
                    className={getInitButtonClass()}
                >
                    {isReady ? (
                        <>READY <i className="fas fa-check ml-2"></i></>
                    ) : (
                        'Initialize Sequence'
                    )}
                </button>

                {/* File Upload Button */}
                <div className="relative w-14 h-full shrink-0">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.pdf,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        onClick={() => fileInputRef.current?.click()}
                        className="util-btn w-full h-full flex items-center justify-center bg-black/5 hover:bg-black/10 border border-black/5 rounded-xl cursor-pointer transition text-gray-500 hover:text-[var(--primary)]"
                    >
                        <i className="fas fa-upload text-lg"></i>
                    </label>
                </div>
            </div>

            {/* File Indicator */}
            <div className={`file-indicator flex items-center justify-center gap-2 mt-3 text-[10px] text-gray-500 font-mono uppercase tracking-widest h-4 ${fileName ? 'visible' : ''}`}>
                <i className="fas fa-file-alt text-[var(--primary)]"></i>
                <span className="truncate max-w-[200px]">
                    {fileName || 'no file loaded'}
                </span>
                {fileName && (
                    <button
                        onClick={onClear}
                        className="hover:text-red-500 ml-1 transition"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default TextInput;
