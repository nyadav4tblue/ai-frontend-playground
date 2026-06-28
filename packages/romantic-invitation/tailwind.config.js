/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Enhanced romantic color palette
      colors: {
        rose: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        romantic: {
          blush: '#ff6b9d',
          coral: '#ff8e53',
          mauve: '#c084fc',
          lavender: '#a78bfa',
          midnight: '#0c0521',
          twilight: '#1a0a2e',
          dusk: '#16213e',
          deep: '#0f3460',
          ocean: '#082255',
        }
      },
      fontFamily: {
        // Enhanced font stack for romantic headings
        heading: ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Lato', 'Inter', 'system-ui', 'sans-serif'],
        elegant: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
        'romantic-float': 'romantic-float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gentle-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'romantic-float': {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg)' 
          },
          '33%': { 
            transform: 'translateY(-10px) rotate(2deg)' 
          },
          '66%': { 
            transform: 'translateY(-5px) rotate(-1deg)' 
          },
        },
        'glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(244, 63, 94, 0.6), 0 0 40px rgba(244, 63, 94, 0.3)'
          },
        },
        'heartbeat': {
          '0%, 100%': { 
            transform: 'scale(1)' 
          },
          '25%': { 
            transform: 'scale(1.1)' 
          },
          '50%': { 
            transform: 'scale(1)' 
          },
          '75%': { 
            transform: 'scale(1.05)' 
          },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      backgroundImage: {
        'gradient-romantic': 'linear-gradient(135deg, #ff6b9d 0%, #ff8e53 50%, #f43f5e 100%)',
        'gradient-deep-romantic': 'linear-gradient(135deg, #0c0521 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #082255 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%)',
      },
      boxShadow: {
        'romantic': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'romantic-lg': '0 20px 60px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'glow-rose': '0 0 30px rgba(244, 63, 94, 0.4)',
        'glow-rose-light': '0 0 20px rgba(244, 63, 94, 0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
