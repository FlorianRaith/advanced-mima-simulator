const colors = require('tailwindcss/colors');

module.exports = {
    purge: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            white: colors.white,
            black: colors.black,
            gray: colors.gray,
            primary: colors.teal,
            secondary: colors.gray,
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
