/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7c3aed',
          dark: '#4f46e5',
          light: '#a78bfa',
        },
        surface: {
          0: '#0a0a14',
          1: '#0d0d1a',
          2: '#12121e',
          3: '#1a1a2e',
          4: '#1e1e35',
        },
        border: '#2d2d50',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
