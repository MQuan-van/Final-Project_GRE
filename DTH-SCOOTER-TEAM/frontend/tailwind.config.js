/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        asphalt: "#050505",
        smoke: "#8b8f99",
        racing: "#ef233c",
        cyanbolt: "#4cc9f0"
      },
      boxShadow: {
        glow: "0 0 80px rgba(76, 201, 240, 0.18), 0 0 110px rgba(239, 35, 60, 0.16)"
      }
    }
  },
  plugins: []
};
