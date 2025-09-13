import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'base-content': 'var(--color-base-content)',
        'base-100': 'var(--color-base-100)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["cupcake", "forest"],
  },
}
