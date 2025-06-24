/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#2d3748',
        accent: '#3182ce',
        surface: '#ffffff',
        background: '#f7fafc',
        success: '#48bb78',
        warning: '#ed8936',
        error: '#e53e3e',
        info: '#4299e1',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Playfair Display', 'serif'],
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      aspectRatio: {
        '16/10': '16 / 10',
        '4/3': '4 / 3'
      }
    },
  },
  plugins: [],
}