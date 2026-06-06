/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        secondary: '#1e293b',
        accent: '#6366f1',
        'accent-hover': '#4f46e5',
        muted: '#94a3b8',
        border: '#334155',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-ring': 'pulse-ring 1s ease-out infinite',
        'skeleton': 'skeleton-shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}