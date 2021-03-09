module.exports = {
    purge: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                "blue-green": "#3de58b",
            },
            fontFamily: {
                "red-hat-display": ['"Red Hat Display"', "serif"],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
