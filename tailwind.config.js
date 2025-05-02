/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f3ff',
        'neon-pink': '#ff00ff',
        'neon-purple': '#9d00ff',
        'neon-green': '#00ff88',
        'dark-bg': '#0f0f1a',
        'card-bg': 'rgba(15, 15, 26, 0.95)',
        'text-primary': '#ffffff',
        'text-secondary': '#b8b8d3',
        'success': '#00ff88',
        'error': '#ff5555',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-neon': 'radial-gradient(circle at 25% 25%, rgba(0, 243, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.08) 0%, transparent 50%)',
      },
      animation: {
        'shine': 'shine 3s infinite',
        'pulse': 'pulse 2s infinite',
        'slideIn': 'slideIn 0.3s ease-out',
        'modalFadeIn': 'modalFadeIn 0.3s ease-out',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'rotate(30deg) translate(-30%, -30%)' },
          '100%': { transform: 'rotate(30deg) translate(30%, 30%)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        slideIn: {
          'from': { top: '-100px', opacity: '0' },
          'to': { top: '20px', opacity: '1' },
        },
        modalFadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
