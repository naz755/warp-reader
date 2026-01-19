/**
 * Ambience Component
 * 
 * Renders decorative background blur effects that add visual depth to the app.
 * Automatically hidden when using the monochrome theme for a cleaner look.
 * 
 * Props:
 *   - theme: Current theme - hidden when 'mono'
 */

import React from 'react';

const Ambience = ({ theme }) => {
    // Hide ambience for monochrome theme
    if (theme === 'mono') {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-30">
            {/* Top-right purple glow */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"></div>

            {/* Bottom-left lime glow */}
            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-lime-900/10 rounded-full blur-[100px]"></div>
        </div>
    );
};

export default Ambience;
