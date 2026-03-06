/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#141414',
        'bg-card': '#1a1a1a',
        'text-primary': '#f5f5f0',
        'text-secondary': '#a0a0a0',
        'accent': '#d4a5ff',
        'outflow': '#ffb74d',
        'negative': '#ff5252',
        'border': '#2a2a2a',
      }
    },
  },
  plugins: [],
}
