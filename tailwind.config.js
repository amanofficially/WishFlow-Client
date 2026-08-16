/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        // Sampled straight from the logo mark's gradient sweep.
        brand: {
          50: "#f5f3ff",
          100: "#ede8ff",
          200: "#dcd2fe",
          300: "#c1acfc",
          400: "#a47ef8",
          500: "#8b4eef",
          600: "#7c2fe0",
          700: "#6c22c4",
          800: "#591da0",
          900: "#481a7f",
        },
        accent: {
          50: "#fdf3fb",
          100: "#fce8f8",
          200: "#f9cdef",
          300: "#f5a3e2",
          400: "#ee6fd0",
          500: "#e246bc",
          600: "#c92c9e",
          700: "#a6217f",
          800: "#871f68",
          900: "#711d57",
        },
      },
      backgroundImage: {
        // The app's one signature gradient — violet to magenta, the same
        // sweep as the logo mark. Used for primary CTAs and key accents,
        // never as a full-page wash, so it reads as premium, not loud.
        "brand-gradient": "linear-gradient(135deg, #7c2fe0 0%, #c92c9e 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #f5f3ff 0%, #fdf3fb 100%)",
      },
      boxShadow: {
        brand: "0 10px 30px -10px rgba(124, 47, 224, 0.35)",
        "brand-lg": "0 20px 45px -12px rgba(124, 47, 224, 0.4)",
        glow: "0 0 0 4px rgba(139, 78, 239, 0.12)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(24px, -30px) scale(1.08)" },
          "66%": { transform: "translate(-18px, 18px) scale(0.94)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
        fadeIn: "fadeIn 0.4s ease-out forwards",
        blob: "blob 9s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        gradientShift: "gradientShift 6s ease infinite",
        floaty: "floaty 3.5s ease-in-out infinite",
        popIn: "popIn 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};
