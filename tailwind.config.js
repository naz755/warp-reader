/**
 * Tailwind CSS Configuration
 * 
 * Configures Tailwind for the Warp Reader application.
 * Extends the default theme with custom colors matching the original design.
 */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'space': ['"Space Grotesk"', 'sans-serif'],
                'mono': ['"Roboto Mono"', 'monospace'],
            },
            colors: {
                'acid-lime': '#ccff00',
                'acid-red': '#ff003c',
                'cyber-cyan': '#00f2ff',
                'cyber-magenta': '#ff00e1',
            },
        },
    },
    plugins: [],
}
