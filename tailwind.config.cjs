const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0A0F1E", soft: "#121A30", raised: "#1C2642", abyss: "#070B14" },
        fog: "#9AA6C8",
        accent: { DEFAULT: "#6F5BFF", strong: "#5B46F0", soft: token("accent-soft") },
        spark: "#29D8FF",
        paper: token("paper"),
        surface: token("surface"),
        text: token("text"),
        line: token("line"),
        mute: token("mute"),
        danger: token("danger"),
        focus: token("focus"),
      },
      borderRadius: {
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      fontFamily: {
        display: ["Geist", "system-ui", "sans-serif"],
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      keyframes: {
        pop: {
          from: { opacity: 0, transform: "scale(0.97) translateY(-2px)" },
          to: { opacity: 1, transform: "scale(1) translateY(0)" },
        },
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
        blink: { "0%, 49%": { opacity: 1 }, "50%, 100%": { opacity: 0 } },
      },
      animation: {
        pop: "pop 0.14s ease-out",
        fade: "fade 0.15s ease-out",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
