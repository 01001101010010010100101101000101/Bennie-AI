/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bennie-blue': {
          'light': '#2563eb',
          'dark': '#3b82f6',
        },
        'bennie-gold': '#f59e0b',
        'navy': '#1e3a8a',
        'light-bg': '#f3f4f6',
        'dark-bg': '#111827',
        'light-card': '#ffffff',
        'dark-card': '#1f2937',
        'light-text': '#1f2937',
        'dark-text': '#d1d5db',
        'light-text-secondary': '#6b7280',
        'dark-text-secondary': '#9ca3af',
      },
    },
  },
  plugins: [],
}
