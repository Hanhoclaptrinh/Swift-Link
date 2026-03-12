/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agent: {
          900: '#050a15', // very dark neon background
          800: '#0a192f', // dark blue/gray surface
          700: '#112240', // lighter surface for cards
          accent: '#00d2ff', // bright cyan accent
          hover: '#3a86ff', // hover bright blue
          purple: '#b026ff', // purple accent for gradients
        }
      },
      backgroundImage: {
        'futuristic-gradient': 'linear-gradient(135deg, rgba(16,25,47,1) 0%, rgba(5,10,21,1) 100%)',
        'glow-cyan': 'radial-gradient(circle at center, rgba(0, 210, 255, 0.15) 0%, transparent 60%)',
        'glow-purple': 'radial-gradient(circle at center, rgba(176, 38, 255, 0.15) 0%, transparent 60%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 210, 255, 0.5), 0 0 20px rgba(0, 210, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(176, 38, 255, 0.5), 0 0 20px rgba(176, 38, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
