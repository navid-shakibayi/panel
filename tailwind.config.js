/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          color1: '#211d2c',
          color12: '#2a2433',
          color13: '#0d0d0d',
          color14: '#181a1f',

          color2: '#e94040',
          color21: '#9f9c98',

          color3: '#134D3F',
          color31: '#1D7660',

          color4: '#920f61',

          color5: '#DC3545',
        },
      },

      animation: {
        "spin-slow": 'spin 8s linear infinite',
        rotate: "rotate 10s linear infinite",
        'moving-dot': 'moving-dot 10s linear infinite 5s',
      },

      keyframes: {
        'moving-dot': {
          '0%': { bottom: '0', right: '0' },
          '20%': { bottom: '100%', right: '0', transform: 'translateY(100%)' },
          '40%': { bottom: '100%', right: '100%', transform: 'translate(100%, 100%)' },
          '60%': { bottom: '0', right: '100%', transform: 'translateX(100%)' },
          '100%': { bottom: '0', right: '100%', transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}

