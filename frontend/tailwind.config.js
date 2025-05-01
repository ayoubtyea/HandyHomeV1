// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  style: {
    // why use postcssOptions? -> https://github.com/dilanx/craco/issues/353
    postcssOptions: {
        plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
        ],
    },
},
}
}