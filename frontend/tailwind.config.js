// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',         // Indigo-500
        'primary-dark': '#4f46e5',  // Indigo-600
        // You can customize as needed
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
};



