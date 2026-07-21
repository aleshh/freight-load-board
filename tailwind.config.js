/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-text)',
        brand: 'var(--color-brand)',
      },
      borderRadius: {
        control: 'var(--radius-control)',
      },
    },
  },
  plugins: [],
};
