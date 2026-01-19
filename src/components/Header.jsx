/**
 * Header Component
 * 
 * Displays the Warp logo with glitch effect, theme switcher buttons,
 * and version badge. Controls the visual theme of the entire application.
 * 
 * Props:
 *   - theme: Current theme ('default', 'cyber', 'mono')
 *   - onThemeChange: Callback when theme is changed
 */

import React from 'react';
import '../styles/components/Header.css';

const Header = ({ theme, onThemeChange }) => {
    /**
     * Get the active state class for theme buttons
     */
    const getThemeButtonClass = (buttonTheme) => {
        const baseClass = 'w-8 h-8 rounded-full flex items-center justify-center text-xs transition active:scale-95';

        if (theme === buttonTheme) {
            switch (buttonTheme) {
                case 'default':
                    return `${baseClass} text-lime-400`;
                case 'cyber':
                    return `${baseClass} text-cyan-400`;
                case 'mono':
                    return `${baseClass} text-black`;
                default:
                    return `${baseClass} text-gray-500`;
            }
        }

        return `${baseClass} text-gray-500 hover:text-gray-300`;
    };

    return (
        <header className="flex justify-between items-start mb-12">
            {/* Logo and Slogan */}
            <div className="relative">
                <h1 className="text-5xl glitch-logo italic font-bold">warp</h1>
                <div className="slogan-text text-[10px] tracking-[0.3em] uppercase mt-1 pl-1">
                    velocity reading
                </div>
            </div>

            {/* Theme Switcher and Version */}
            <div className="flex flex-col items-end gap-3">
                {/* Theme Toggle Buttons */}
                <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/5 panel">
                    <button
                        onClick={() => onThemeChange('default')}
                        className={getThemeButtonClass('default')}
                        title="Vapor (Default)"
                    >
                        <i className="fas fa-bolt"></i>
                    </button>
                    <button
                        onClick={() => onThemeChange('cyber')}
                        className={getThemeButtonClass('cyber')}
                        title="Cyber Blue"
                    >
                        <i className="fas fa-microchip"></i>
                    </button>
                    <button
                        onClick={() => onThemeChange('mono')}
                        className={getThemeButtonClass('mono')}
                        title="Monochrome"
                    >
                        <i className="fas fa-layer-group"></i>
                    </button>
                </div>

                {/* Version Badge */}
                <div className="version-badge text-[9px] font-mono border px-2 py-1 rounded-full">
                    v1.0.8-react
                </div>
            </div>
        </header>
    );
};

export default Header;
