/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444',
        dark: '#0f172a'
      }
    },
  },
  plugins: [],
}

