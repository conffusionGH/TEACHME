/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**"
   
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3D3BF3',
        secondary: '#9694FF',
        tertiary: '#EBEAFF',
        error: '#FF2929',
      },
    },
  },
  plugins: [],
};