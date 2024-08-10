/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          color1: '#171717',
          color12: '#1e2024',
          color13: '#0d0d0d',
          color14: '#181a1f',

          color2: '#F9F6EE',
          color21: '#9f9c98',

          color3: '#134D3F',
          color31: '#1D7660',

          color4: '#920f61',

          color5: '#DC3545',
        },
      },
    },
  },
  plugins: [],
}

