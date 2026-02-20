/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
        sans: ['IBM Plex Sans', 'Helvetica', 'sans-serif'],
      },
      colors: {
        bg: '#0e0e0f',
        surface: '#18181b',
        surface2: '#222226',
        border: '#2e2e35',
        accent: '#e8c547',
        accent2: '#e05a3a',
        muted: '#6b6b7a',
        saved: '#4ade80',
      },
      animation: {
        'pulse-dot': 'pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-once': 'spin 0.7s linear',
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-up': 'fadeUp 0.3s ease-out forwards',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
