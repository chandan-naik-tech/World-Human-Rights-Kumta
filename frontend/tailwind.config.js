/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#1e293b',
          DEFAULT: '#0f172a',
          dark: '#020617',
          royal: '#0B2545',
          deep: '#134074',
        },
        gold: {
          light: '#F4D068',
          DEFAULT: '#D4AF37',
          dark: '#AA7C11',
          pale: '#C5A880',
        },
        accent: '#8DA9C4',
        slateBg: '#EEF4F8'
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    },
  },
  plugins: [],
}
