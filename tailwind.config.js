/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        win: {
          blue: '#0078d4',
          'blue-hover': '#106ebe',
          'blue-active': '#005a9e',
          bg: '#0f172a',
          dark: '#1c1c1c',
          card: 'rgba(32, 32, 32, 0.75)',
          acrylic: 'rgba(20, 20, 25, 0.65)',
          border: 'rgba(255, 255, 255, 0.12)',
          'border-light': 'rgba(0, 0, 0, 0.1)',
          hover: 'rgba(255, 255, 255, 0.08)',
          'hover-light': 'rgba(0, 0, 0, 0.05)',
          active: 'rgba(255, 255, 255, 0.14)',
          text: '#ffffff',
          'text-muted': '#a1a1aa',
          accent: '#0078d4',
        },
      },
      backdropBlur: {
        win: '30px',
        acrylic: '40px',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
        mono: ['Cascadia Code', 'Consolas', 'Courier New', 'monospace'],
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        bootSpinner: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        windowsDots: {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '50%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0)', opacity: 0 },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bootSpinner: 'bootSpinner 1.2s linear infinite',
      },
      boxShadow: {
        win: '0 12px 32px 0 rgba(0, 0, 0, 0.37), 0 2px 6px 0 rgba(0, 0, 0, 0.2)',
        'win-glow': '0 0 20px rgba(0, 120, 212, 0.4)',
        taskbar: '0 -4px 20px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
