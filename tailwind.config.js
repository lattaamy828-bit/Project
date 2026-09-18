/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /**
       * Tailwind's default opacity scale is multiples of five, so utilities such
       * as `bg-midnight-900/97` silently generate nothing. This design leans on
       * fine-grained alpha (near-opaque panels, hairline borders), so the scale
       * is opened up to every integer. JIT still only emits what is used.
       */
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, String(i / 100)])),
      colors: {
        midnight: { DEFAULT: '#070a18', 900: '#070a18', 800: '#0b1026', 700: '#111a3d', 600: '#18265a' },
        cobalt: { DEFAULT: '#2a5fd7', 700: '#1b3a8c', 500: '#2a5fd7', 300: '#6f9bef' },
        gold: { DEFAULT: '#e3b23c', 600: '#c0902a', 400: '#f2c14e', 200: '#f7dd9b' },
        cream: { DEFAULT: '#f4ead7', 200: '#fbf6ec', 400: '#e5d7bd', 600: '#bfae90' },
        olive: { DEFAULT: '#6b7a4b', 700: '#4d5a34' },
        umber: { DEFAULT: '#6b4423', 900: '#3a2415' },
        ink: '#05060d',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Cormorant', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        script: ['"Petit Formal Script"', '"Snell Roundhand"', 'cursive'],
      },
      letterSpacing: { widest2: '0.32em' },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
        oil: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        drift: { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(0,-14px,0)' } },
        shimmer: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
        swirl: { to: { transform: 'rotate(360deg)' } },
        flicker: { '0%,100%': { opacity: '1' }, '45%': { opacity: '.72' }, '55%': { opacity: '.9' } },
      },
      animation: {
        drift: 'drift 7s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        swirl: 'swirl 60s linear infinite',
        flicker: 'flicker 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
