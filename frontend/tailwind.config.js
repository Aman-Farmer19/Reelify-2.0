/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#8B5CF6', // Violet Primary Accent
          glow: '#A855F7',    // Vibrant Glow
          dark: '#6D28D9',
          light: '#C084FC',
        },
        surface: {
          0: '#090414', // Global Background
          1: '#12061F', // Cards & Sidebar
          2: '#160826', // Sub-panels
          3: '#1F0B36', // Interactive Cards
          4: '#280F45', // Hover Active Cards
        },
        border: 'rgba(139, 92, 246, 0.20)',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px rgba(139, 92, 246, 0.20)',
        'glow-strong': '0 0 35px rgba(139, 92, 246, 0.35)',
      }
    },
  },
  plugins: [],
}
