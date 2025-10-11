/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      colors: {
        parchment: {
          50: '#fdfcf9',
          100: '#f9f6ed',
          200: '#f2ead9',
          300: '#e8dbc3',
          400: '#d9c7a3',
          500: '#c9b083',
        },
      },
    },
  },
  plugins: [],
}
