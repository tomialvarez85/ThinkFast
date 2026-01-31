/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#FAFAFA',
        primary: {
          DEFAULT: '#7C3AED',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          foreground: '#A1A1AA',
        },
        accent: {
          DEFAULT: '#6D28D9',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#171717',
          foreground: '#737373',
        },
        border: '#262626',
        input: '#262626',
        ring: '#7C3AED',
        card: {
          DEFAULT: '#1A1A1A',
          foreground: '#FAFAFA',
        },
        popover: {
          DEFAULT: '#1A1A1A',
          foreground: '#FAFAFA',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
