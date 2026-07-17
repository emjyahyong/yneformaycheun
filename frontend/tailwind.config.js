/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1d1f20',
        surface: '#e9e9ea',
        canvas: '#f2f2f3',
        divider: '#1d1f2029',
        accent: {
          DEFAULT: '#5980a6',
          100: '#eef6ff', 200: '#d6ebff', 300: '#b5d9fd', 400: '#94bce3',
          500: '#749dc4', 600: '#597ea3', 700: '#416180', 800: '#2c455d', 900: '#1d2d3d',
        },
        neutral: {
          100: '#f5f5f8', 200: '#e7e7ea', 300: '#d4d4d7', 400: '#b7b7ba',
          500: '#98989b', 600: '#7a7a7d', 700: '#5d5d60', 800: '#424244', 900: '#2b2b2d',
        },
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
        body: ['"Barlow"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
