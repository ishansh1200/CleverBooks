/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc", // Slate 50
        error: "#b91c1c", // Red 700
        error_container: "#fee2e2", // Red 100
        on_background: "#0f172a", // Slate 900
        on_error: "#ffffff",
        on_error_container: "#7f1d1d",
        on_primary: "#ffffff",
        on_primary_container: "#1e3a8a",
        on_secondary: "#ffffff",
        on_secondary_container: "#134e4a",
        on_surface: "#334155", // Slate 700
        on_surface_variant: "#64748b", // Slate 500
        on_tertiary: "#ffffff",
        on_tertiary_container: "#7c2d12",
        outline: "#cbd5e1", // Slate 300
        outline_variant: "#e2e8f0", // Slate 200
        primary: "#1e40af", // Blue 800
        primary_container: "#dbeafe", // Blue 100
        secondary: "#0f766e", // Teal 700
        secondary_container: "#ccfbf1", // Teal 100
        surface: "#ffffff",
        surface_bright: "#ffffff",
        surface_container: "#f1f5f9", // Slate 100
        surface_container_high: "#e2e8f0", // Slate 200
        surface_container_highest: "#cbd5e1", // Slate 300
        surface_container_low: "#f8fafc",
        surface_container_lowest: "#ffffff",
        surface_dim: "#f1f5f9",
        tertiary: "#c2410c", // Orange 700
        tertiary_container: "#ffedd5" // Orange 100
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};