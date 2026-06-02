/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f472b6',
          hover: '#ec4899',
        },
        secondary: '#a855f7',
        accent: '#06b6d4',
        background: '#0f172a',
        surface: {
          DEFAULT: '#1e293b',
          highlight: '#334155',
          glass: 'rgba(15, 23, 42, 0.8)',
        },
        text: {
          DEFAULT: '#f8fafc',
          muted: '#cbd5e1',
        },
        border: '#334155',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(236, 72, 153, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
        'mesh': 'meshAnimation 15s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(244, 114, 182, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(244, 114, 182, 0.7)' },
        },
        meshAnimation: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        }
      }
    },
  },
  plugins: [],
}
