/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Halloween Font
      fontFamily: {
        'spooky': ['"Special Elite"', 'cursive'],
      },
      // Halloween Color Palette (Requirements: 10.1, 10.2)
      colors: {
        // Primary Colors (backgrounds, main UI)
        deepPurple: '#1a0a2e',
        midnightBlue: '#0d1b2a',
        bloodOrange: '#ff6b35',
        // Accent Colors (text, icons, effects)
        ghostlyWhite: '#f0e6ff',
        pumpkinOrange: '#ff9500',
        toxicGreen: '#39ff14',
      },
      // Halloween Gradients
      backgroundImage: {
        'spooky-night': 'linear-gradient(135deg, #1a0a2e 0%, #0d1b2a 50%, #1a0a2e 100%)',
        'haunted-glow': 'linear-gradient(180deg, #ff6b35 0%, #ff9500 100%)',
        'mystical-purple': 'linear-gradient(45deg, #1a0a2e 0%, #f0e6ff 100%)',
        'toxic-shimmer': 'linear-gradient(90deg, #39ff14 0%, #ff9500 50%, #39ff14 100%)',
      },
      // Halloween Animations
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'ghost-float': 'ghostFloat 4s ease-in-out infinite',
        'bat-fly': 'batFly 0.5s ease-out',
        'pumpkin-bounce': 'pumpkinBounce 0.6s ease-out',
        'spooky-pulse': 'spookyPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #ff9500, 0 0 10px #ff9500' },
          '50%': { boxShadow: '0 0 20px #ff6b35, 0 0 30px #ff6b35' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        ghostFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.7' },
          '25%': { transform: 'translateY(-15px) rotate(5deg)', opacity: '0.9' },
          '50%': { transform: 'translateY(-5px) rotate(-3deg)', opacity: '0.8' },
          '75%': { transform: 'translateY(-20px) rotate(3deg)', opacity: '0.6' },
        },
        batFly: {
          '0%': { transform: 'translateX(-20px) translateY(0)', opacity: '1' },
          '100%': { transform: 'translateX(100px) translateY(-20px)', opacity: '0' },
        },
        pumpkinBounce: {
          '0%': { transform: 'scale(0) rotate(-180deg)' },
          '60%': { transform: 'scale(1.2) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        spookyPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      // Halloween Box Shadows
      boxShadow: {
        'halloween-glow': '0 0 15px rgba(255, 107, 53, 0.5), 0 0 30px rgba(255, 149, 0, 0.3)',
        'ghost-glow': '0 0 20px rgba(240, 230, 255, 0.4)',
        'toxic-glow': '0 0 15px rgba(57, 255, 20, 0.5)',
        'spooky-card': '0 4px 20px rgba(26, 10, 46, 0.5), 0 0 40px rgba(255, 107, 53, 0.1)',
      },
    },
  },
  plugins: [],
}
