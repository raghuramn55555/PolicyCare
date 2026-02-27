/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'india-blue': '#0F4C75',
        'india-green': '#00A651',
        'india-orange': '#FF9933',
      },
    },
  },
  plugins: [],
}

