/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Global Projects Blue/Yellow palette
        dark: {
          950: 'rgb(var(--color-dark-950) / <alpha-value>)',
          900: 'rgb(var(--color-dark-900) / <alpha-value>)',
          850: 'rgb(var(--color-dark-850) / <alpha-value>)',
          800: 'rgb(var(--color-dark-800) / <alpha-value>)',
          700: 'rgb(var(--color-dark-700) / <alpha-value>)',
          600: 'rgb(var(--color-dark-600) / <alpha-value>)',
        },
        primary: {
          DEFAULT: '#1A6DD9', // Dark Blue from logo
          dark: '#0F4A9E',
          light: '#2E7EE8',
        },
        yellow: {
          DEFAULT: '#F0C419', // Golden Yellow from logo
          bright: '#FFFF00',  // Bright Yellow for sidebar
          light: '#F5D547',
        },
        accent: {
          DEFAULT: '#1A6DD9', // Dark Blue (Primary Action)
          hover: '#0F4A9E',
          glow: '#2E7EE8',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
