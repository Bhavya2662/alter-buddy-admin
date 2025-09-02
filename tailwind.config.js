const colors = require("tailwindcss/colors");


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf3f3",
          100: "#fbe8e9",
          200: "#f6d5d6",
          300: "#eeb3b5",
          400: "#e4888e",
          500: "#d45561",
          600: "#c13d50",
          700: "#a22e42",
          800: "#88293c",
          900: "#752638",
          950: "#40111a",
        },
        brandPrimary: {
          50: "#fef5fd",
          100: "#fdeafc",
          200: "#fad4f6",
          300: "#f6b1ec",
          400: "#ef83de",
          500: "#e253cc",
          600: "#c633ab",
          700: "#a4278b",
          800: "#91257a",
          900: "#6e215c",
          950: "#480a39",
        },
        brandSecondary: {
          50: "#edfefe",
          100: "#d2fbfb",
          200: "#aaf5f7",
          300: "#6fedf1",
          400: "#2ddae3",
          500: "#11b9c4",
          600: "#1198a9",
          700: "#157a89",
          800: "#1a6270",
          900: "#1a525f",
          950: "#0b3741",
        },
      },
      fontFamily: {
        sans: ["'Montserrat', sans-serif"],
        poppins: ["'Poppins', sans-serif"],
        roboto: ["'Roboto', sans-serif"],
      },
    },
  },
  plugins: [],
};

