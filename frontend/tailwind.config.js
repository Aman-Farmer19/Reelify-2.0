/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#8b5cf6', // Violet
          glow: '#d946ef',    // Fuchsia Glow
          dark: '#6d28d9',
          light: '#c084fc',
        },
        surface: {
          0: '#020208', // Deepest background
          1: '#070714', // Panels
          2: '#0d0d22', // Sub-panels
          3: '#141432', // Cards
          4: '#1a1a3f', // Hover active cards
        },
        border: 'rgba(255, 255, 255, 0.07)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px rgba(139, 92, 246, 0.15)',
        'glow-strong': '0 0 35px rgba(217, 70, 239, 0.3)',
      }
    },
  },
  plugins: [],
}
