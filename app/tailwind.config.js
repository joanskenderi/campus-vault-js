/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'light-primary': '#f1f5f9', // slate-100
      'light-secondary': '#e2e8f0', // slate-200
      'light-tertiary': '#cbd5e1', // slate-300
      'light-quinary': '#94a3b8', // slate-400

      'dark-primary': '#1e293b', // slate-800
      'dark-secondary': '#334155', // slate-700
      'dark-tertiary': '#475569', // slate-600
      'dark-quinary': '#64748b', // slate-500

      'light-red': '#fca5a5', // red-300
      'dark-red': '#dc2626', // red-600

      'light-blue': '#3b82f6', // blue-500
      'dark-blue': '#2563eb', // blue-600
    },
    extend: {},
  },
  plugins: [],
};
