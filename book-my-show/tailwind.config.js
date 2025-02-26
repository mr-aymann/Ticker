// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          100: "#F84464",
          90: "#FA6A82"
        },
        gray: {
          100: "#E5E5E5",
          90: '#2C2B2B',
          80: '#666666',
          70: '#FCFDFF',
          60: "#333338"
        },
        green :{
          100: '#1DE782'
        },
        blue:{
          100: "#2B3149"
        }
      },
    },
  },
  plugins: [],
};