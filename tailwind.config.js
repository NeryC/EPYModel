module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "ssm": "300px"
      },
      fontSize: {
        xsm: ["0.8rem", "1rem"],
      },
      colors: {
        "gray-theme": "#BEC9DF",
        "default-text": "#364057",
        back: "#F7F9FF",
        "deep-blue": "#0D39C9",
        "dark-blue": "#111725",
        "text-secondary": "#58688d",
        "light-background": "#EEF4FF",
      },
      boxShadow: {
        "complete-box": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      },
    },
  },
  plugins: [],
};
