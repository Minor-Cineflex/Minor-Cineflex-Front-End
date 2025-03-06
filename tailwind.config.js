/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#4C3A51',
        'bg-sec': '#774360',
        'bt-main': '#E7AB79',
        'bt-sec': '#B25068',
      },
    },
  },
  plugins: [],
}

