/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/apps/**/*.{js,ts,jsx,tsx}" // هذا السطر يكفل رؤية كل ملفات المعلم والطلاب
  ],
  theme: {
    extend: {
      colors: {
        // هذه المتغيرات ستسحب قيمها من ملف tokens.css الخاص بالمعلم تلقائياً!
        primary: "var(--primary)",
        bgMain: "var(--bg)",
        bgCard: "var(--card)",
        bgSoft: "var(--glass)",
        textPrimary: "var(--text)",
        textSecondary: "var(--secondary)",
        glow: "var(--glow)",
        borderColor: "var(--border)"
      }
    },
  },
  plugins: [],
}