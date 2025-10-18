/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'prussian-blue': '#003049',
        'fire-engine-red': '#d62828',
        'orange-wheel': '#f77f00',
        'xanthous': '#fcbf49',
        'vanilla': '#eae2b7',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'Consolas', 'Monaco', 'monospace'],
      },
      animation: {
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};
