
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "custom-red": "#141852"
      },
      spacing: {
        "0.5": "1px"
       }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
