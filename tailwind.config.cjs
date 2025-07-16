/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "coca-cola-black": "#000000",
        "coca-cola-white": "#FFFFFF",
        "coca-cola-red": "#F40000",
        "coca-cola-dark": "#CC0000",
        "coca-cola-orange": "#FF560E",
        "coca-cola-brown": "#E5813E",
        "coca-cola-yellow": "#F79900",
        "coca-cola-sand": "#D7D8FB",
        "coca-cola-grey": "#B59E74",
        "coca-cola-green": "#6ACE7F",
        "coca-cola-blue": "#6AC9CE",
      },
      fontFamily: {
        "coca-cola": ["Coca-Cola", "sans-serif"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
      },
    },
  },
  plugins: [],
};
