/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#136ac1", /* Given by user */
        "primary-container": "#dbeafe", /* Blue 100 */
        "primary-dim": "#1d4ed8", /* Blue 700 */
        surface: "#f8fafc", /* Slate 50 */
        "surface-variant": "#cbd5e1", /* Slate 300 */
        "on-surface": "#0f172a", /* Slate 900 */
        "on-surface-variant": "#475569", /* Slate 600 */
        "surface-container-lowest": "#ffffff", /* White */
        "surface-container-low": "#f1f5f9", /* Slate 100 */
        "surface-container": "#e2e8f0", /* Slate 200 */
        "surface-container-highest": "#cbd5e1", /* Slate 300 */
        outline: "#94a3b8", /* Slate 400 */
        "outline-variant": "#cbd5e1", /* Slate 300 */
        secondary: "#475569", /* Slate 600 */
      }
    },
  },
  plugins: [],
}
