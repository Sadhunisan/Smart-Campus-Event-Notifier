/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        primary: '#0f172a',
        accent: '#1d4ed8',
        mint: '#14b8a6',
        peach: '#f97316',
      },
    },
  },
  plugins: [],
};
