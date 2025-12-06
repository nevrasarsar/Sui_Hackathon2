/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quiz-bg': '#1D1E6C',
        'quiz-accent': '#FF7F50',
        'quiz-highlight': '#AB9AEB',
        'neon-green': '#39FF14',
        'neon-purple': '#D500F9',
      },
      fontFamily: {
        'outfit': ['"Outfit"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}