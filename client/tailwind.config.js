/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coco: '#2A2B2A',
        khaki: '#706C61',
        cream: '#F8F4E3',
        cherry: '#E5446D',
        orange: '#FF8966',
      },
    },
  },
  plugins: [],
};
