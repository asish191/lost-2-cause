/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B46C1',
        secondary: '#9B59B6',
        accent: '#D6BCFA',
        background: '#F5F6FA',
        text: '#4A4A4A',
        highlight: '#FFFFFF',
        success: '#48BB78',
        gradientStart: '#C3B1E1',
        gradientEnd: '#6B46C1',
        'mint-500': 'oklch(0.72 0.11 178)',
      },
    },
  },
  plugins: [],
};
