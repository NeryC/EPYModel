module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xsm: ["0.8rem", "1rem"],
      },
      colors: {
        "gray-theme": "#BEC9DF",
        "default-text": "#364057",
      },
      boxShadow: {
        "complete-box": "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
      },
    },
  },
  plugins: [],
};
