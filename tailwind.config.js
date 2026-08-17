/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#090D14',
          900: '#0E1420',
          800: '#131924',
          700: '#1E2638',
          600: '#2A354D',
        },
        slatebg: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          800: '#1E293B',
        },
        emeraldbrand: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        cyandata: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0284C7',
        },
        amberalert: {
          500: '#F59E0B',
          600: '#D97706',
        },
        crimsondanger: {
          500: '#EF4444',
          600: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
        bangla: ['Hind Siliguri', 'Noto Sans Bengali', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}
