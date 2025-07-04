/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./index.html",
    "./practice.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./public/**/*.html"
  ],
  safelist: [
    'border-blue-500',
    'bg-blue-500',
    'text-blue-500',
  ],
  theme: {
    extend: {
      colors: {
        // Use modern color names to silence warnings
        gray: colors.gray,
        blue: colors.blue,
        green: colors.green,
        red: colors.red,
        // Semantic tokens and custom colors
        'ds-bg-primary': '#555555',
        'ds-bg-secondary': '#666666',
        'ds-bg-surface': '#dddddd',
        'ds-bg-overlay': 'rgba(0,0,0,0.5)',
        'ds-text-primary': '#ffffff',
        'ds-text-secondary': '#111111',
        'ds-text-muted': '#aaaaaa',
        'ds-interactive-primary': '#4d4d4d',
        'ds-interactive-primary-hover': '#3a3a3a',
        'ds-interactive-secondary': '#e5e5e5',
        'ds-interactive-secondary-hover': '#cccccc',
        'ds-feedback-success': '#89ff89',
        'ds-feedback-error': '#ff8989',
        'ds-feedback-focus': '#ffffff',
      },
      spacing: {
        px: "1px",
        0: "0px",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        xs: "0.5rem",
        sm: "0.625rem",
        md: "1rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        "4xl": "5rem",
      },
      fontFamily: {
        sans: ["Jost", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
      },
      lineHeight: {
        tight: "1.2",
        snug: "1.4",
        normal: "1.6",
        relaxed: "1.8",
      },
      maxWidth: {
        container: "75rem",
        content: "50rem",
        full: "100%",
        screen: "100vw",
      },
    },
  },
  plugins: [],
};

