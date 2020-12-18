const plugin = require('tailwindcss/plugin');


module.exports = {
  purge: [{
    mode:'layers',
    content:['./views/**/**.ejs']
  }],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors:{
        cwc:{
          red:'#E84977',
          blue:'#49AADE',
          gray:'#222222'
        }
      },
      fontFamily:{
        body:['Sniglet']
      }
    },    
  },
  variants: {
    extend: {},
  },
  plugins: [],
}