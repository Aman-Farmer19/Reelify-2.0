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
          0: '#0c0420', // Deepest background — visible dark purple
          1: '#15082e', // Panels — rich violet-indigo
          2: '#1a0535', // Sub-panels — deep purple
          3: '#221248', // Cards — muted vivid purple
          4: '#2a1858', // Hover active cards — lifted purple
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
