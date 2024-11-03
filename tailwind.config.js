/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      animation:{
        'spin-slow': 'spin 2s linear infinite',
        'animate-spin-slow': 'spin 2s linear infinite',
      }
    },
  },
  plugins: [],
}

